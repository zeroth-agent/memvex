import { z } from 'zod';

/**
 * Schema for a guard rule.
 * Rules define what agents can and cannot do — action-level permissions.
 * 
 * Examples from memvex.yaml:
 *   - action: "spend_money", max: 50, require_approval_above: 50
 *   - action: "send_external_email", require_approval: true
 *   - action: "modify_production", blocked: true
 */
export const GuardRuleSchema = z.object({
    action: z.string().describe("The action name (e.g. 'spend_money', 'send_external_email')"),
    max: z.number().optional().describe("Maximum auto-approved amount"),
    require_approval: z.boolean().optional().describe("Always require human approval"),
    require_approval_above: z.number().optional().describe("Require approval above this threshold"),
    blocked: z.boolean().optional().describe("Completely block this action"),
    message: z.string().optional().describe("Message to show when action is blocked or pending"),
});

export type GuardRule = z.infer<typeof GuardRuleSchema>;

/**
 * Result of a guard check.
 */
export type GuardDecision = {
    action: string;
    allowed: boolean;
    reason: string;
    requiresApproval: boolean;
};

/**
 * An approval request stored in the queue.
 */
export const ApprovalRequestSchema = z.object({
    id: z.string(),
    action: z.string(),
    agent: z.string().optional().describe("Which agent requested this"),
    params: z.record(z.unknown()).optional(),
    status: z.enum(['pending', 'approved', 'denied']),
    createdAt: z.string().datetime(),
    decidedAt: z.string().datetime().optional(),
});

export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;
