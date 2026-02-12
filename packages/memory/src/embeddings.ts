/**
 * Embeddings interface for semantic memory search.
 * 
 * Phase 2 will implement this with local embeddings (e.g. transformers.js)
 * or pluggable providers (OpenAI, Ollama, etc).
 * 
 * For now, memory recall uses simple substring matching.
 * This file defines the interface that future backends will implement.
 */
export interface EmbeddingProvider {
    /** Generate an embedding vector for the given text. */
    embed(text: string): Promise<number[]>;

    /** Compute similarity between two vectors. */
    similarity(a: number[], b: number[]): number;
}

/**
 * Placeholder: no-op embedding provider.
 * Returns empty vectors; recall falls back to text matching.
 */
export class NoOpEmbeddingProvider implements EmbeddingProvider {
    async embed(_text: string): Promise<number[]> {
        return [];
    }

    similarity(_a: number[], _b: number[]): number {
        return 0;
    }
}
