import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SqliteApprovalQueue } from '../sqlite-approvals.js';
import path from 'path';
import os from 'os';

// Hoist mocks
const { mockPrepare, mockRun, mockGet, mockAll, mockExec, mockPragma, mockClose } = vi.hoisted(() => {
    return {
        mockPrepare: vi.fn(),
        mockRun: vi.fn(),
        mockGet: vi.fn(),
        mockAll: vi.fn(),
        mockExec: vi.fn(),
        mockPragma: vi.fn(),
        mockClose: vi.fn(),
    };
});

// Mock better-sqlite3
vi.mock('better-sqlite3', () => {
    return {
        default: function Database() {
            return {
                prepare: mockPrepare,
                exec: mockExec,
                pragma: mockPragma,
                close: mockClose,
            };
        },
    };
});

describe('SqliteApprovalQueue', () => {
    let queue: SqliteApprovalQueue;

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock behaviors
        mockPrepare.mockReturnValue({
            run: mockRun,
            get: mockGet,
            all: mockAll,
        });

        // Initialize queue (triggers exec for schema)
        queue = new SqliteApprovalQueue(':memory:');
    });

    it('should initialize schema', () => {
        expect(mockExec).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS approval_requests'));
    });

    it('should submit a request', () => {
        const action = 'test_action';
        const result = queue.submit(action, 'agent1', { foo: 'bar' });

        expect(result.id).toBeDefined();
        expect(result.status).toBe('pending');

        expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO approval_requests'));
        expect(mockRun).toHaveBeenCalledWith(
            result.id,
            action,
            'agent1',
            JSON.stringify({ foo: 'bar' }),
            null, // reason
            'pending',
            expect.any(String) // created_at
        );
    });

    it('should approve a request', () => {
        const id = 'req-123';
        const mockReq = {
            id,
            action: 'test',
            status: 'approved',
            created_at: new Date().toISOString(),
            decided_at: new Date().toISOString(),
            params: '{}'
        };

        mockGet.mockReturnValue(mockReq); // Return updated row

        const result = queue.approve(id);

        expect(result).toBeDefined();
        expect(result?.status).toBe('approved');

        expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE approval_requests'));
        expect(mockGet).toHaveBeenCalledWith(expect.any(String), id);
    });

    it('should deny a request', () => {
        const id = 'req-123';
        const mockReq = {
            id,
            action: 'test',
            status: 'denied',
            created_at: new Date().toISOString(),
            decided_at: new Date().toISOString(),
            params: '{}'
        };

        mockGet.mockReturnValue(mockReq);

        const result = queue.deny(id);

        expect(result?.status).toBe('denied');
        expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE approval_requests'));
    });
});
