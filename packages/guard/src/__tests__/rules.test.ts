import { describe, it, expect } from 'vitest';
import { RulesEngine } from '../rules.js';
import { GuardRule } from '../schema.js';

describe('RulesEngine', () => {
    const rules: GuardRule[] = [
        { action: 'blocked_action', blocked: true, message: 'This is blocked' },
        { action: 'approval_action', require_approval: true },
        { action: 'threshold_action', require_approval_above: 50 },
        { action: 'max_action', max: 100 },
    ];
    const engine = new RulesEngine(rules);

    it('should allow actions with no matching rule', () => {
        const decision = engine.check('unknown_action');
        expect(decision.allowed).toBe(true);
        expect(decision.requiresApproval).toBe(false);
    });

    it('should block actions marked as blocked', () => {
        const decision = engine.check('blocked_action');
        expect(decision.allowed).toBe(false);
        expect(decision.reason).toContain('This is blocked');
    });

    it('should require approval for actions marked require_approval', () => {
        const decision = engine.check('approval_action');
        expect(decision.allowed).toBe(false);
        expect(decision.requiresApproval).toBe(true);
    });

    it('should require approval for threshold actions only above limit', () => {
        // Below limit -> allowed
        let decision = engine.check('threshold_action', { amount: 10 });
        expect(decision.allowed).toBe(true);

        // Above limit -> needs approval
        decision = engine.check('threshold_action', { amount: 60 });
        expect(decision.allowed).toBe(false);
        expect(decision.requiresApproval).toBe(true);
    });

    it('should block max limit actions completely', () => {
        // Below limit -> allowed
        let decision = engine.check('max_action', { amount: 90 });
        expect(decision.allowed).toBe(true);

        // Above limit -> blocked (not approval, just disallowed)
        decision = engine.check('max_action', { amount: 110 });
        expect(decision.allowed).toBe(false);
        expect(decision.requiresApproval).toBe(false); // Hard block
        expect(decision.reason).toContain('exceeds maximum');
    });
});
