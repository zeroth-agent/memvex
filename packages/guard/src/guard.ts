import { RulesEngine } from './rules.js';
import { ApprovalBackend, InMemoryApprovalQueue } from './approvals.js';
import { GuardRule, GuardDecision } from './schema.js';

export class GuardModule {
    private engine: RulesEngine;
    private approvals: ApprovalBackend;

    constructor(rules: GuardRule[], backend?: ApprovalBackend) {
        this.engine = new RulesEngine(rules);
        this.approvals = backend || new InMemoryApprovalQueue();
    }

    static async create(config?: { enabled: boolean; rules: GuardRule[]; persist?: boolean }): Promise<GuardModule> {
        if (!config || !config.enabled) {
            // If disabled or no config, we return a permissive guard.
            return new GuardModule([]);
        }

        let backend: ApprovalBackend;
        if (config.persist !== false) {
            try {
                const { SqliteApprovalQueue } = await import('./sqlite-approvals.js');
                backend = new SqliteApprovalQueue();
            } catch (error) {
                process.stderr.write('⚠ SQLite unavailable (better-sqlite3 missing). Using in-memory approval queue.\n');
                backend = new InMemoryApprovalQueue();
            }
        } else {
            backend = new InMemoryApprovalQueue();
        }

        return new GuardModule(config.rules, backend);
    }

    /**
     * Check if an action is allowed.
     */
    check(action: string, params?: Record<string, unknown>, agent?: string): GuardDecision & { approvalId?: string } {
        const decision = this.engine.check(action, params);

        if (decision.requiresApproval) {
            // Only create request if one isn't already pending? 
            // For now, simple logic: always create new request.
            const request = this.approvals.submit(action, agent, params, decision.reason);
            return { ...decision, approvalId: request.id };
        }

        return decision;
    }

    /** Approve a pending request by ID. */
    approve(id: string) {
        return this.approvals.approve(id);
    }

    /** Deny a pending request by ID. */
    deny(id: string) {
        return this.approvals.deny(id);
    }

    /** Get all pending approval requests. */
    getPendingApprovals() {
        return this.approvals.getPending();
    }

    /** Get recent approval history. */
    getHistory(limit?: number) {
        return this.approvals.getHistory(limit);
    }

    /** Get a specific approval request. */
    get(id: string) {
        return this.approvals.get(id);
    }
}
