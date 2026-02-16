import { MemoryBackend, InMemoryStore } from './store.js';
import { SqliteStore } from './sqlite-store.js';
import { MemoryEntry, MemoryQuery } from './schema.js';

export class MemoryModule {
    private backend: MemoryBackend;

    constructor(backend?: MemoryBackend) {
        this.backend = backend || new InMemoryStore();
    }

    static create(config?: { storage?: string; path?: string }): MemoryModule {
        if (config?.storage === 'sqlite') {
            return new MemoryModule(new SqliteStore(config.path));
        }
        return new MemoryModule(new InMemoryStore());
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
