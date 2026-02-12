import { ApprovalRequest } from './schema.js';

/**
 * ApprovalQueue — manages pending human approval requests.
 * 
 * When an agent tries an action that requires approval,
 * the request is queued here for the user to approve/deny
 * via the dashboard or CLI.
 */
export class ApprovalQueue {
    private queue: ApprovalRequest[] = [];

    /** Submit a new approval request. */
    submit(action: string, agent?: string, params?: Record<string, unknown>): ApprovalRequest {
        const request: ApprovalRequest = {
            id: crypto.randomUUID(),
            action,
            agent,
            params,
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
}
