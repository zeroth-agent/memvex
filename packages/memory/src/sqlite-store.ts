import Database from 'better-sqlite3';
import path from 'path';
import { MemoryBackend } from './store.js';
import { MemoryEntry, MemoryQuery } from './schema.js';

const DEFAULT_DB_PATH = path.join(process.cwd(), '.memvex', 'memory.db');

export class SqliteStore implements MemoryBackend {
    private db: Database.Database;

    constructor(dbPath?: string) {
        const resolvedPath = dbPath || DEFAULT_DB_PATH;
        const dir = path.dirname(resolvedPath);

        const fs = require('fs');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        this.db = new Database(resolvedPath);
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('foreign_keys = ON');
        this.initSchema();
    }

    private initSchema(): void {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS memories (
                id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                namespace TEXT,
                agent TEXT,
                tags TEXT,
                created_at TEXT NOT NULL,
                expires_at TEXT
            );

            CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts
                USING fts5(content, content='memories', content_rowid='rowid');

            CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
                INSERT INTO memories_fts(rowid, content) VALUES (new.rowid, new.content);
            END;

            CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
                INSERT INTO memories_fts(memories_fts, rowid, content) VALUES('delete', old.rowid, old.content);
            END;

            CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
                INSERT INTO memories_fts(memories_fts, rowid, content) VALUES('delete', old.rowid, old.content);
                INSERT INTO memories_fts(rowid, content) VALUES (new.rowid, new.content);
            END;

            CREATE INDEX IF NOT EXISTS idx_memories_namespace ON memories(namespace);
            CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at);
        `);
    }

    async store(entry: Omit<MemoryEntry, 'id' | 'createdAt'>): Promise<MemoryEntry> {
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO memories (id, content, namespace, agent, tags, created_at, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            entry.content,
            entry.namespace || null,
            entry.agent || null,
            entry.tags ? JSON.stringify(entry.tags) : null,
            createdAt,
            entry.expiresAt || null
        );

        return {
            id,
            content: entry.content,
            namespace: entry.namespace,
            agent: entry.agent,
            tags: entry.tags,
            createdAt,
            expiresAt: entry.expiresAt,
        };
    }

    async recall(query: MemoryQuery): Promise<MemoryEntry[]> {
        let sql: string;
        const params: any[] = [];

        if (query.query && query.query.trim().length > 0) {
            sql = `
                SELECT m.id, m.content, m.namespace, m.agent, m.tags, m.created_at, m.expires_at
                FROM memories m
                INNER JOIN memories_fts fts ON m.rowid = fts.rowid
                WHERE memories_fts MATCH ?
            `;
            params.push(this.sanitizeFtsQuery(query.query));
        } else {
            sql = `
                SELECT id, content, namespace, agent, tags, created_at, expires_at
                FROM memories
                WHERE 1=1
            `;
        }

        if (query.namespace) {
            sql += ` AND m.namespace = ?`;
            params.push(query.namespace);
        }

        sql += ` ORDER BY m.created_at DESC LIMIT ?`;
        params.push(query.limit || 10);

        const rows = this.db.prepare(sql).all(...params) as any[];
        return rows.map(row => this.rowToEntry(row));
    }

    async forget(id: string): Promise<boolean> {
        const result = this.db.prepare('DELETE FROM memories WHERE id = ?').run(id);
        return result.changes > 0;
    }

    async list(namespace?: string): Promise<MemoryEntry[]> {
        let sql = 'SELECT id, content, namespace, agent, tags, created_at, expires_at FROM memories';
        const params: any[] = [];

        if (namespace) {
            sql += ' WHERE namespace = ?';
            params.push(namespace);
        }

        sql += ' ORDER BY created_at DESC';

        const rows = this.db.prepare(sql).all(...params) as any[];
        return rows.map(row => this.rowToEntry(row));
    }

    close(): void {
        this.db.close();
    }

    private rowToEntry(row: any): MemoryEntry {
        return {
            id: row.id,
            content: row.content,
            namespace: row.namespace || undefined,
            agent: row.agent || undefined,
            tags: row.tags ? JSON.parse(row.tags) : undefined,
            createdAt: row.created_at,
            expiresAt: row.expires_at || undefined,
        };
    }

    private sanitizeFtsQuery(query: string): string {
        return query
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0)
            .map(word => `"${word}"`)
            .join(' OR ');
    }
}
