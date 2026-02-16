import { z } from 'zod';

/**
 * Schema for a single memory entry.
 * Memories are cross-agent: any agent can store, any agent can recall.
 */
export const MemoryEntrySchema = z.object({
    id: z.string().describe("Unique memory ID"),
    content: z.string().describe("The memory content"),
    namespace: z.string().optional().describe("Namespace for grouping (e.g. 'work', 'personal')"),
    agent: z.string().optional().describe("Which agent stored this memory"),
    tags: z.array(z.string()).optional().describe("Tags for filtering"),
    createdAt: z.string().datetime().describe("When the memory was created"),
    expiresAt: z.string().datetime().optional().describe("Auto-expiration timestamp"),
});

export type MemoryEntry = z.infer<typeof MemoryEntrySchema>;

/**
 * Schema for memory recall query.
 */
export const MemoryQuerySchema = z.object({
    query: z.string().describe("Natural language search query"),
    namespace: z.string().optional().describe("Filter by namespace"),
    limit: z.number().optional().default(10).describe("Max results to return"),
    tags: z.array(z.string()).optional().describe("Filter by tags"),
});

export type MemoryQuery = z.input<typeof MemoryQuerySchema>;
