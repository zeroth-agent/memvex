import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SqliteStore } from '../sqlite-store.js';
import path from 'path';
import os from 'os';

// Hoist mocks so they are available in vi.mock factory
const { mockPrepare, mockRun, mockAll, mockExec, mockPragma, mockClose } = vi.hoisted(() => {
    return {
        mockPrepare: vi.fn(),
        mockRun: vi.fn(),
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

describe('SqliteStore', () => {
    let store: SqliteStore;
    let dbPath: string;

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mock behaviors
        mockPrepare.mockReturnValue({
            run: mockRun,
            all: mockAll,
        });
        mockRun.mockReturnValue({ changes: 1, lastInsertRowid: 1 });
        mockAll.mockReturnValue([]);

        const tmpDir = os.tmpdir();
        dbPath = path.join(tmpDir, `memvex-test-${Date.now()}.db`);
        store = new SqliteStore(dbPath);
    });

    it('should initialize schema on creation', () => {
        expect(mockExec).toHaveBeenCalled();
        const initSql = mockExec.mock.calls[0][0];
        expect(initSql).toContain('CREATE TABLE IF NOT EXISTS memories');
        expect(initSql).toContain('CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts');
    });

    it('should store a memory', async () => {
        const memoryData = {
            content: 'The sky is blue.',
            namespace: 'nature',
            agent: 'test-agent',
            tags: ['color', 'fact']
        };

        const result = await store.store(memoryData);

        expect(result.id).toBeDefined();
        expect(result.content).toBe(memoryData.content);

        // Verify SQL generation
        expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO memories'));
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String), // id
            memoryData.content,
            memoryData.namespace,
            memoryData.agent,
            JSON.stringify(memoryData.tags),
            expect.any(String), // created_at
            null // expires_at
        );
    });

    it('should recall memories using FTS search', async () => {
        const query = { query: 'fox' };

        // Mock return value for recall
        const mockRows = [{
            id: '123',
            content: 'The quick brown fox',
            namespace: 'test',
            agent: 'agent1',
            tags: '["animal"]',
            created_at: new Date().toISOString(),
            expires_at: null
        }];
        mockAll.mockReturnValue(mockRows);

        const results = await store.recall(query);

        expect(results).toHaveLength(1);
        expect(results[0].content).toBe('The quick brown fox');

        // Verify SQL generation
        expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('memories_fts MATCH ?'));

        // Verify FTS sanitization: "fox" -> "\"fox\""
        expect(mockAll).toHaveBeenCalledWith(expect.stringContaining('"fox"'), 10); // Check arg count too if possible, but exact match fine
    });

    it('should recall memories with namespace filter', async () => {
        const query = { query: 'test', namespace: 'work' };

        await store.recall(query);

        expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('AND m.namespace = ?'));
        expect(mockAll).toHaveBeenCalledWith(expect.stringContaining('"test"'), 'work', 10);
    });

    it('should delete a memory', async () => {
        mockRun.mockReturnValue({ changes: 1 });

        const result = await store.forget('mem-123');

        expect(result).toBe(true);
        expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM memories WHERE id = ?'));
        expect(mockRun).toHaveBeenCalledWith('mem-123');
    });
});
