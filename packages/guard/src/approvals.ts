import { ApprovalRequest } from './schema.js';

/**
 * ApprovalQueue — manages pending human approval requests.
 * 
 * When an agent tries an action that requires approval,
 * the request is queued here for the user to approve/deny
 * via the dashboard or CLI.
 */
// Interface for approval backends (SQLite, In-Memory)
export interface ApprovalBackend {
    submit(action: string, agent?: string, params?: Record<string, unknown>, reason?: string): ApprovalRequest;
    approve(id: string): ApprovalRequest | null;
    deny(id: string): ApprovalRequest | null;
    getPending(): ApprovalRequest[];
    get(id: string): ApprovalRequest | undefined;
    getHistory(limit?: number): ApprovalRequest[];
}

/**
 * InMemoryApprovalQueue — implementation for testing or non-persistent use.
 */
export class InMemoryApprovalQueue implements ApprovalBackend {
    private queue: ApprovalRequest[] = [];

    /** Submit a new approval request. */
    submit(action: string, agent?: string, params?: Record<string, unknown>, reason?: string): ApprovalRequest {
        const request: ApprovalRequest = {
            id: crypto.randomUUID(),
            action,
            agent,
            params,
            // Store reason if schema supports it (update schema.ts if needed, but keeping simple for now)
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        this.queue.push(request);
        return request;
    }

    /** Approve a pending request. */
    approve(id: string): ApprovalRequest | null {
        const request = this.queue.find(r => r.id === id);
        if (!request || request.status !== 'pending') return null;
        request.status = 'approved';
        request.decidedAt = new Date().toISOString();
        return request;
    }

    /** Deny a pending request. */
    deny(id: string): ApprovalRequest | null {
        const request = this.queue.find(r => r.id === id);
        if (!request || request.status !== 'pending') return null;
        request.status = 'denied';
        request.decidedAt = new Date().toISOString();
        return request;
    }

    /** Get all pending requests. */
    getPending(): ApprovalRequest[] {
        return this.queue.filter(r => r.status === 'pending');
    }

    /** Get a request by ID. */
    get(id: string): ApprovalRequest | undefined {
        return this.queue.find(r => r.id === id);
    }

    /** Get history (all requests, newest first). */
    getHistory(limit: number = 20): ApprovalRequest[] {
        return [...this.queue]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);
    }
}
