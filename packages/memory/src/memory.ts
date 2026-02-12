import { MemoryBackend, InMemoryStore } from './store.js';
import { MemoryEntry, MemoryQuery } from './schema.js';

/**
 * MemoryModule — the cross-agent memory router.
 * 
 * "Agent A learns something, Agent B knows it."
 * 
 * This module abstracts over pluggable memory backends (InMemory, SQLite, Mem0).
 * It provides the unified interface that all MCP tools call.
 */
export class MemoryModule {
    private backend: MemoryBackend;

    constructor(backend?: MemoryBackend) {
        this.backend = backend || new InMemoryStore();
    }

    /** Store a new memory, optionally tagged with the source agent and namespace. */
    async store(content: string, options?: { namespace?: string; agent?: string; tags?: string[] }): Promise<MemoryEntry> {
        return this.backend.store({
            content,
            namespace: options?.namespace,
            agent: options?.agent,
            tags: options?.tags,
        });
    }

    /** Recall memories matching a natural-language query. */
    async recall(query: string, options?: { namespace?: string; limit?: number; tags?: string[] }): Promise<MemoryEntry[]> {
        return this.backend.recall({
            query,
            namespace: options?.namespace,
            limit: options?.limit,
            tags: options?.tags,
        });
    }

    /** Forget a specific memory by ID. */
    async forget(id: string): Promise<boolean> {
        return this.backend.forget(id);
    }

    /** List all memories, optionally filtered by namespace. */
    async list(namespace?: string): Promise<MemoryEntry[]> {
        return this.backend.list(namespace);
    }
}
