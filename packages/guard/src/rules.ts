import { GuardRule, GuardDecision } from './schema.js';

/**
 * RulesEngine — evaluates guard rules against incoming actions.
 * 
 * This is the "User Policy Engine" described in the vision:
 * not content safety, but action-level permissions.
 * 
 * "Can I spend $50?" → Check rules → Allowed/Blocked/NeedsApproval
 */
export class RulesEngine {
    private rules: GuardRule[];

    constructor(rules: GuardRule[]) {
        this.rules = rules;
    }

    /**
     * Evaluate an action against the loaded rules.
     * @param action - The action name (e.g. "spend_money")
     * @param params - Optional parameters (e.g. { amount: 75 })
     */
    check(action: string, params?: Record<string, unknown>): GuardDecision {
        const rule = this.rules.find(r => r.action === action);

        // No rule = allowed by default
        if (!rule) {
            return { action, allowed: true, reason: 'No rule defined for this action', requiresApproval: false };
        }

        // Hard block
        if (rule.blocked) {
            return { action, allowed: false, reason: rule.message || `Action "${action}" is blocked`, requiresApproval: false };
        }

        // Always require approval
        if (rule.require_approval) {
            return { action, allowed: false, reason: rule.message || `Action "${action}" requires approval`, requiresApproval: true };
        }

        // Threshold-based approval
        if (rule.require_approval_above !== undefined && params?.amount !== undefined) {
            const amount = Number(params.amount);
            if (amount > rule.require_approval_above) {
                return {
                    action,
                    allowed: false,
                    reason: `Amount $${amount} exceeds auto-approval limit of $${rule.require_approval_above}`,
                    requiresApproval: true,
                };
            }
        }

        // Max limit check
        if (rule.max !== undefined && params?.amount !== undefined) {
            const amount = Number(params.amount);
            if (amount > rule.max) {
                return {
                    action,
                    allowed: false,
                    reason: `Amount $${amount} exceeds maximum of $${rule.max}`,
                    requiresApproval: false,
                };
            }
        }

        return { action, allowed: true, reason: 'Action permitted by rules', requiresApproval: false };
    }
}
