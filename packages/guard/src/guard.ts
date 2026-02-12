import { RulesEngine } from './rules.js';
import { ApprovalQueue } from './approvals.js';
import { GuardRule, GuardDecision } from './schema.js';

/**
 * GuardModule — the action-level permission engine.
 * 
 * "What can I do?" — Every agent checks Guard before taking consequential actions.
 * This is the differentiated pillar: not content safety, but personal action control.
 */
export class GuardModule {
    private engine: RulesEngine;
    private approvals: ApprovalQueue;

    constructor(rules: GuardRule[]) {
        this.engine = new RulesEngine(rules);
        this.approvals = new ApprovalQueue();
    }

    /**
     * Check if an action is allowed.
     * Returns the decision and, if approval is required, creates an approval request.
     */
    check(action: string, params?: Record<string, unknown>, agent?: string): GuardDecision & { approvalId?: string } {
        const decision = this.engine.check(action, params);

        if (decision.requiresApproval) {
            const request = this.approvals.submit(action, agent, params);
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
}
