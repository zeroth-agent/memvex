import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { MemoryBackend } from './store.js';
import { MemoryEntry, MemoryQuery } from './schema.js';

const DEFAULT_DB_PATH = path.join(process.cwd(), '.memvex', 'memory.db');

export class SqlJsStore implements MemoryBackend {
    private db!: Database;
    private dbPath: string;

    private constructor(db: Database, dbPath: string) {
        this.db = db;
        this.dbPath = dbPath;
    }

    static async create(dbPath?: string): Promise<SqlJsStore> {
        // Load sql.js with WASM from node_modules
        const SQL = await initSqlJs({
            locateFile: (filename: string) => {
                // pnpm uses .pnpm/package@version/node_modules/package structure
                const wasmPath = path.resolve(process.cwd(), 'node_modules/.pnpm/sql.js@1.14.0/node_modules/sql.js/dist', filename);
                return wasmPath;
            }
        });
        const resolvedPath = dbPath || DEFAULT_DB_PATH;
        const dir = path.dirname(resolvedPath);

        // Ensure directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Load existing database or create new
        let db: Database;
        if (fs.existsSync(resolvedPath)) {
            const buffer = fs.readFileSync(resolvedPath);
            db = new SQL.Database(buffer);
        } else {
            db = new SQL.Database();
        }

        const store = new SqlJsStore(db, resolvedPath);
        store.initSchema();
        return store;
    }

    private initSchema(): void {
        // Note: sql.js doesn't support FTS5, so we skip full-text search indexing
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

            CREATE INDEX IF NOT EXISTS idx_memories_namespace ON memories(namespace);
            CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at);
        `);
        this.save();
    }

    private save(): void {
        const data = this.db.export();
        fs.writeFileSync(this.dbPath, Buffer.from(data));
    }

    async store(entry: Omit<MemoryEntry, 'id' | 'createdAt'>): Promise<MemoryEntry> {
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        this.db.run(
            `INSERT INTO memories (id, content, namespace, agent, tags, created_at, expires_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                entry.content,
                entry.namespace || null,
                entry.agent || null,
                entry.tags ? JSON.stringify(entry.tags) : null,
                createdAt,
                entry.expiresAt || null
            ]
        );

        this.save();

        return {
            id,
            content: entry.content,
            namespace: entry.namespace,
            agent: entry.agent,
            tags: entry.tags,
            createdAt,
            expiresAt: entry.expiresAt
        };
    }

    async recall(query: MemoryQuery): Promise<MemoryEntry[]> {
        let sql = 'SELECT id, content, namespace, agent, tags, created_at, expires_at FROM memories WHERE 1=1';
        const params: any[] = [];

        // sql.js doesn't support FTS5, so we use LIKE for basic text search
        if (query.query) {
            sql += ' AND content LIKE ?';
            params.push(`%${query.query}%`);
        }

        // Add filters
        if (query.namespace) {
            sql += ' AND namespace = ?';
            params.push(query.namespace);
        }
        if (query.tags && query.tags.length > 0) {
            const tagsCond = query.tags.map(() => 'tags LIKE ?').join(' OR ');
            sql += ` AND (${tagsCond})`;
            query.tags.forEach(tag => params.push(`%"${tag}"%`));
        }

        sql += ' ORDER BY created_at DESC';

        if (query.limit) {
            sql += ' LIMIT ?';
            params.push(query.limit);
        }

        const stmt = this.db.prepare(sql);
        stmt.bind(params);

        const results: MemoryEntry[] = [];
        while (stmt.step()) {
            const row = stmt.getAsObject();
            results.push({
                id: row.id as string,
                content: row.content as string,
                namespace: row.namespace as string | undefined,
                agent: row.agent as string | undefined,
                tags: row.tags ? JSON.parse(row.tags as string) : undefined,
                createdAt: row.created_at as string,
                expiresAt: row.expires_at as string | undefined
            });
        }
        stmt.free();

        return results;
    }

    async forget(id: string): Promise<boolean> {
        this.db.run('DELETE FROM memories WHERE id = ?', [id]);
        const changes = this.db.getRowsModified();
        this.save();
        return changes > 0;
    }

    async list(namespace?: string): Promise<MemoryEntry[]> {
        let sql = 'SELECT id, content, namespace, agent, tags, created_at, expires_at FROM memories';
        const params: any[] = [];

        if (namespace) {
            sql += ' WHERE namespace = ?';
            params.push(namespace);
        }

        sql += ' ORDER BY created_at DESC';

        const stmt = this.db.prepare(sql);
        stmt.bind(params);

        const results: MemoryEntry[] = [];
        while (stmt.step()) {
            const row = stmt.getAsObject();
            results.push({
                id: row.id as string,
                content: row.content as string,
                namespace: row.namespace as string | undefined,
                agent: row.agent as string | undefined,
                tags: row.tags ? JSON.parse(row.tags as string) : undefined,
                createdAt: row.created_at as string,
                expiresAt: row.expires_at as string | undefined
            });
        }
        stmt.free();

        return results;
    }

    async clear(namespace?: string): Promise<number> {
        let sql = 'DELETE FROM memories';
        const params: any[] = [];

        if (namespace) {
            sql += ' WHERE namespace = ?';
            params.push(namespace);
        }

        this.db.run(sql, params);
        const changes = this.db.getRowsModified();
        this.save();
        return changes;
    }
}
