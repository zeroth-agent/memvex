import { MemoryEntry, MemoryQuery } from './schema.js';

/**
 * Abstract interface for memory storage backends.
 * Memvex doesn't rebuild memory — it routes it.
 * Implementations can wrap SQLite, Mem0, Letta, or any other backend.
 */
export interface MemoryBackend {
    store(entry: Omit<MemoryEntry, 'id' | 'createdAt'>): Promise<MemoryEntry>;
    recall(query: MemoryQuery): Promise<MemoryEntry[]>;
    forget(id: string): Promise<boolean>;
    list(namespace?: string): Promise<MemoryEntry[]>;
}

/**
 * In-memory store for development and testing.
 * Production users should use SQLite or a pluggable backend (Mem0, etc).
 */
export class InMemoryStore implements MemoryBackend {
    private memories: MemoryEntry[] = [];

    async store(entry: Omit<MemoryEntry, 'id' | 'createdAt'>): Promise<MemoryEntry> {
        const memory: MemoryEntry = {
            ...entry,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        this.memories.push(memory);
        return memory;
    }

    async recall(query: MemoryQuery): Promise<MemoryEntry[]> {
        let results = this.memories;

        if (query.namespace) {
            results = results.filter(m => m.namespace === query.namespace);
        }
        if (query.tags && query.tags.length > 0) {
            results = results.filter(m =>
                m.tags && query.tags!.some(t => m.tags!.includes(t))
            );
        }

        // Simple substring matching for now; FTS5/embeddings come in Phase 2
        results = results.filter(m =>
            m.content.toLowerCase().includes(query.query.toLowerCase())
        );

        return results.slice(0, query.limit || 10);
    }

    async forget(id: string): Promise<boolean> {
        const idx = this.memories.findIndex(m => m.id === id);
        if (idx === -1) return false;
        this.memories.splice(idx, 1);
        return true;
    }

    async list(namespace?: string): Promise<MemoryEntry[]> {
        if (namespace) {
            return this.memories.filter(m => m.namespace === namespace);
        }
        return [...this.memories];
    }
}
