import { z } from 'zod';

export const IdentityConfigSchema = z.object({
    name: z.string().describe("The user's full name"),
    role: z.string().describe("The user's professional role or title"),
    communication: z.record(z.string()).optional().describe("Communication style preferences by context"),
    coding: z.object({
        languages: z.array(z.string()).optional(),
        style: z.record(z.string()).optional(),
        preferences: z.array(z.string()).optional(),
    }).optional().describe("Coding preferences and style guides"),
});

export type IdentityConfig = z.infer<typeof IdentityConfigSchema>;
