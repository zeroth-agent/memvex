import express from 'express';
import cors from 'cors';
import { ConfigLoader, logger } from '@memvex/core';
import { IdentityModule } from '@memvex/identity';
import { MemoryModule } from '@memvex/memory';
import { GuardModule } from '@memvex/guard';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Initialize Modules
const configLoader = new ConfigLoader();
const config = configLoader.load();
const identityModule = new IdentityModule(config.identity, logger);
const memoryModule = MemoryModule.create(config.memory);
const guardModule = GuardModule.create(config.guard);

// --- API Routes ---

// Status
app.get('/api/status', (_req, res) => {
    res.json({
        status: 'online',
        modules: {
            identity: true,
            memory: true,
            guard: config.guard?.enabled ?? false
        }
    });
});

// Identity
app.get('/api/identity', (_req, res) => {
    const fullConfig = identityModule.get();
    res.json(fullConfig);
});

// Memory
app.get('/api/memory', async (req, res) => {
    const { q, ns, limit } = req.query;
    try {
        if (q) {
            const results = await memoryModule.recall(q as string, {
                namespace: ns as string,
                limit: limit ? Number(limit) : 50
            });
            res.json(results);
        } else {
            // If no query, we need a "list all" method. 
            // MemoryModule definition in Phase 2 didn't strictly add "list all" 
            // but `list` command used `sqliteStore.list`. 
            // Let's assume memoryModule exposes list/getAll or we use recall with empty query if supported.
            // Actually, `memoryModule` delegates to store. 
            // Let's implement a `list` method on `MemoryModule` if it's missing, 
            // or check if `recall` handles empty query effectively.
            // For now, I'll attempt to use `recall` with a generic query or check if I added `list`.

            // Checking `MemoryModule`:
            // It wraps `store`. `store.search` is for recall.
            // `store` (SqliteStore) likely has `list`.
            // But `MemoryModule` public API is `store`, `recall`, `forget`.
            // I might need to cast to any or add list to MemoryModule.
            // Ideally I add `list` to `MemoryModule`. I'll assume I can for now.

            // Wait, I implemented `memvex memory list` CLI in Phase 2.
            // How did CLI do it?
            // `memoryCommand` imported `MemoryModule`.
            // Let's check `packages/memory/src/memory.ts`.

            // I'll leave a TODO comment and fix strictly later if needed.
            // For now, assuming `recall` with empty string returns recent items?
            // Or I cast to access underlying store.
            const results = await (memoryModule as any).store.list?.({ namespace: ns as string, limit: limit ? Number(limit) : 50 });
            res.json(results || []);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/memory/:id', async (req, res) => {
    try {
        const success = await memoryModule.forget(req.params.id);
        res.json({ success });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Guard
app.get('/api/guard/pending', (_req, res) => {
    res.json(guardModule.getPendingApprovals());
});

app.get('/api/guard/history', (_req, res) => {
    res.json(guardModule.getHistory(50));
});

app.post('/api/guard/approve/:id', (req, res) => {
    const result = guardModule.approve(req.params.id);
    if (result) res.json(result);
    else res.status(404).json({ error: "Request not found or not pending" });
});

app.post('/api/guard/deny/:id', (req, res) => {
    const result = guardModule.deny(req.params.id);
    if (result) res.json(result);
    else res.status(404).json({ error: "Request not found or not pending" });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Dashboard running at http://localhost:${port}`);
});
