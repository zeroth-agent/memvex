import Database from 'better-sqlite3';
import { ApprovalRequest } from './schema.js';
import { ApprovalBackend } from './approvals.js';
import path from 'path';
import fs from 'fs';

export class SqliteApprovalQueue implements ApprovalBackend {
    private db: Database.Database;

    constructor(dbPath?: string) {
        if (!dbPath) {
            const dataDir = path.join(process.cwd(), '.memvex');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            dbPath = path.join(dataDir, 'guard.db');
        }

        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.initialize();
    }

    private initialize() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS approval_requests (
                id          TEXT PRIMARY KEY,
                action      TEXT NOT NULL,
                agent       TEXT,
                params      TEXT,            -- JSON
                reason      TEXT,
                status      TEXT NOT NULL DEFAULT 'pending',
                created_at  TEXT NOT NULL,
                decided_at  TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_approvals_status ON approval_requests(status);
            CREATE INDEX IF NOT EXISTS idx_approvals_date ON approval_requests(created_at);
        `);
    }

    submit(action: string, agent?: string, params?: Record<string, unknown>, reason?: string): ApprovalRequest {
        const request: ApprovalRequest = {
            id: crypto.randomUUID(),
            action,
            agent,
            params,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        const stmt = this.db.prepare(`
            INSERT INTO approval_requests (id, action, agent, params, reason, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            request.id,
            request.action,
            request.agent || null,
            JSON.stringify(request.params || {}),
            reason || null,
            request.status,
            request.createdAt
        );

        return request;
    }

    approve(id: string): ApprovalRequest | null {
        const decidedAt = new Date().toISOString();
        const stmt = this.db.prepare(`
            UPDATE approval_requests 
            SET status = 'approved', decided_at = ? 
            WHERE id = ? AND status = 'pending'
            RETURNING *
        `);

        const row = stmt.get(decidedAt, id) as any;
        if (!row) return null;

        return this.mapRow(row);
    }

    deny(id: string): ApprovalRequest | null {
        const decidedAt = new Date().toISOString();
        const stmt = this.db.prepare(`
            UPDATE approval_requests 
            SET status = 'denied', decided_at = ? 
            WHERE id = ? AND status = 'pending'
            RETURNING *
        `);

        const row = stmt.get(decidedAt, id) as any;
        if (!row) return null;

        return this.mapRow(row);
    }

    getPending(): ApprovalRequest[] {
        const stmt = this.db.prepare(`
            SELECT * FROM approval_requests 
            WHERE status = 'pending' 
            ORDER BY created_at ASC
        `);
        return stmt.all().map(this.mapRow);
    }

    get(id: string): ApprovalRequest | undefined {
        const stmt = this.db.prepare('SELECT * FROM approval_requests WHERE id = ?');
        const row = stmt.get(id) as any;
        return row ? this.mapRow(row) : undefined;
    }

    getHistory(limit: number = 20): ApprovalRequest[] {
        const stmt = this.db.prepare(`
            SELECT * FROM approval_requests 
            ORDER BY created_at DESC 
            LIMIT ?
        `);
        return stmt.all(limit).map(this.mapRow);
    }

    close() {
        this.db.close();
    }

    private mapRow(row: any): ApprovalRequest {
        return {
            id: row.id,
            action: row.action,
            agent: row.agent || undefined,
            params: JSON.parse(row.params || '{}'),
            status: row.status as 'pending' | 'approved' | 'denied',
            createdAt: row.created_at,
            decidedAt: row.decided_at || undefined,
        };
    }
}
