import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApprovalBackend } from './approvals.js';
import { ApprovalRequest } from './schema.js';

const DEFAULT_DB_PATH = path.join(process.cwd(), '.memvex', 'guard.db');

export class SqlJsApprovalQueue implements ApprovalBackend {
    private db!: Database;
    private dbPath: string;

    private constructor(db: Database, dbPath: string) {
        this.db = db;
        this.dbPath = dbPath;
    }

    static async create(dbPath?: string): Promise<SqlJsApprovalQueue> {
        // Get the directory of THIS module (packages/guard/src/)
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        // Navigate to project root: ../../../ from packages/guard/src/
        const projectRoot = path.resolve(currentDir, '../../..');

        // Load sql.js with WASM from node_modules
        const SQL = await initSqlJs({
            locateFile: (filename: string) => {
                // Path to WASM in pnpm structure
                const wasmPath = path.join(projectRoot, 'node_modules/.pnpm/sql.js@1.14.0/node_modules/sql.js/dist', filename);
                return wasmPath;
            }
        });

        // Resolve DB path relative to project root if it's relative
        let resolvedPath = dbPath || DEFAULT_DB_PATH;
        if (resolvedPath.startsWith('.')) {
            resolvedPath = path.resolve(projectRoot, resolvedPath);
        }

        const dir = path.dirname(resolvedPath);

        // Ensure directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        //Load existing database or create new
        let db: Database;
        if (fs.existsSync(resolvedPath)) {
            const buffer = fs.readFileSync(resolvedPath);
            db = new SQL.Database(buffer);
        } else {
            db = new SQL.Database();
        }

        const queue = new SqlJsApprovalQueue(db, resolvedPath);
        queue.initSchema();
        return queue;
    }

    private initSchema(): void {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS approval_requests (
                id TEXT PRIMARY KEY,
                action TEXT NOT NULL,
                agent TEXT,
                params TEXT,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL,
                decided_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_approvals_status ON approval_requests(status);
            CREATE INDEX IF NOT EXISTS idx_approvals_date ON approval_requests(created_at);
        `);
        this.save();
    }

    private save(): void {
        const data = this.db.export();
        fs.writeFileSync(this.dbPath, Buffer.from(data));
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

        this.db.run(
            `INSERT INTO approval_requests (id, action, agent, params, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                request.id,
                request.action,
                request.agent || null,
                JSON.stringify(request.params || {}),
                request.status,
                request.createdAt
            ]
        );

        this.save();
        return request;
    }

    approve(id: string): ApprovalRequest | null {
        const decidedAt = new Date().toISOString();

        // First get the request
        const existing = this.get(id);
        if (!existing || existing.status !== 'pending') return null;

        // Update it
        this.db.run(
            `UPDATE approval_requests 
             SET status = 'approved', decided_at = ?
             WHERE id = ? AND status = 'pending'`,
            [decidedAt, id]
        );

        const changes = this.db.getRowsModified();
        if (changes === 0) return null;

        this.save();

        // Return updated request
        return {
            ...existing,
            status: 'approved',
            decidedAt
        };
    }

    deny(id: string): ApprovalRequest | null {
        const decidedAt = new Date().toISOString();

        // First get the request
        const existing = this.get(id);
        if (!existing || existing.status !== 'pending') return null;

        // Update it
        this.db.run(
            `UPDATE approval_requests 
             SET status = 'denied', decided_at = ?
             WHERE id = ? AND status = 'pending'`,
            [decidedAt, id]
        );

        const changes = this.db.getRowsModified();
        if (changes === 0) return null;

        this.save();

        // Return updated request
        return {
            ...existing,
            status: 'denied',
            decidedAt
        };
    }

    get(id: string): ApprovalRequest | undefined {
        const stmt = this.db.prepare('SELECT * FROM approval_requests WHERE id = ?');
        stmt.bind([id]);

        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return {
                id: row.id as string,
                action: row.action as string,
                agent: row.agent as string | undefined,
                params: row.params ? JSON.parse(row.params as string) : undefined,
                status: row.status as 'pending' | 'approved' | 'denied',
                createdAt: row.created_at as string,
                decidedAt: row.decided_at as string | undefined
            };
        }

        stmt.free();
        return undefined;
    }

    getPending(): ApprovalRequest[] {
        const stmt = this.db.prepare(`
            SELECT * FROM approval_requests 
            WHERE status = 'pending' 
            ORDER BY created_at ASC
        `);
        stmt.bind([]);

        const results: ApprovalRequest[] = [];
        while (stmt.step()) {
            const row = stmt.getAsObject();
            results.push({
                id: row.id as string,
                action: row.action as string,
                agent: row.agent as string | undefined,
                params: row.params ? JSON.parse(row.params as string) : undefined,
                status: row.status as 'pending' | 'approved' | 'denied',
                createdAt: row.created_at as string,
                decidedAt: row.decided_at as string | undefined
            });
        }
        stmt.free();

        return results;
    }

    getHistory(limit: number = 20): ApprovalRequest[] {
        const stmt = this.db.prepare(`
            SELECT * FROM approval_requests 
            ORDER BY created_at DESC 
            LIMIT ?
        `);
        stmt.bind([limit]);

        const results: ApprovalRequest[] = [];
        while (stmt.step()) {
            const row = stmt.getAsObject();
            results.push({
                id: row.id as string,
                action: row.action as string,
                agent: row.agent as string | undefined,
                params: row.params ? JSON.parse(row.params as string) : undefined,
                status: row.status as 'pending' | 'approved' | 'denied',
                createdAt: row.created_at as string,
                decidedAt: row.decided_at as string | undefined
            });
        }
        stmt.free();

        return results;
    }
}
