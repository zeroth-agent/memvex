import { MemoryBackend, InMemoryStore } from './store.js';
import { MemoryEntry, MemoryQuery } from './schema.js';

export class MemoryModule {
    private backend: MemoryBackend;

    constructor(backend?: MemoryBackend) {
        this.backend = backend || new InMemoryStore();
    }

    static async create(config?: { storage?: string; path?: string }): Promise<MemoryModule> {
        if (config?.storage === 'sqlite') {
            try {
                const { SqlJsStore } = await import('./sqljs-store.js');
                return new MemoryModule(await SqlJsStore.create(config.path));
            } catch (error) {
                process.stderr.write(`⚠ SQLite unavailable (sql.js loading failed). Using in-memory storage.\n`);
                process.stderr.write(`  Error details: ${error}\n`);
                return new MemoryModule(new InMemoryStore());
            }
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
