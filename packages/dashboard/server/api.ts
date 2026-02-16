import express from 'express';
import cors from 'cors';
import { ConfigLoader, logger } from '@memvex/core';
import { IdentityModule } from '@memvex/identity';
import { MemoryModule } from '@memvex/memory';
import { GuardModule } from '@memvex/guard';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createDashboardServer(
    injectedModules?: {
        memory: MemoryModule;
        guard: GuardModule;
        identity: IdentityModule;
        config: any
    }
) {
    const app = express();
    const port = 3001;

    let identityModule: IdentityModule;
    let memoryModule: MemoryModule;
    let guardModule: GuardModule;
    let config: any;

    if (injectedModules) {
        // Shared mode (MCP Server)
        ({ memory: memoryModule, guard: guardModule, identity: identityModule, config } = injectedModules);
    } else {
        // Standalone mode (pnpm dev)
        const findConfig = () => {
            if (process.env.MEMVEX_CONFIG) return process.env.MEMVEX_CONFIG;
            const cwdPath = path.join(process.cwd(), 'memvex.yaml');
            if (fs.existsSync(cwdPath)) return cwdPath;
            const rootPath = path.resolve(__dirname, '../../../memvex.yaml');
            if (fs.existsSync(rootPath)) return rootPath;
            return undefined;
        };

        const configPath = findConfig();
        const configLoader = new ConfigLoader(configPath);
        config = configLoader.load();

        identityModule = new IdentityModule(config.identity, logger);
        memoryModule = await MemoryModule.create(config.memory);
        guardModule = await GuardModule.create(config.guard);
    }

    app.use(cors());
    app.use(express.json());

    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));

    // --- API Routes ---
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

    app.get('/api/identity', (_req, res) => res.json(identityModule.get()));

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
                // Fallback list using internal store if possible, or empty search
                // For in-memory, we can try to access the store directly if needed
                // But recall("") might work depending on implementation?
                // Phase 2 implementation of recall uses vector search.
                // Let's rely on basic list support if available or empty recall.
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

    app.get('/api/guard/pending', (_req, res) => res.json(guardModule.getPendingApprovals()));
    app.get('/api/guard/history', (_req, res) => res.json(guardModule.getHistory(50)));

    app.post('/api/guard/approve/:id', (req, res) => {
        const result = guardModule.approve(req.params.id);
        if (result) res.json(result);
        else res.status(404).json({ error: "Request not found" });
    });

    app.post('/api/guard/deny/:id', (req, res) => {
        const result = guardModule.deny(req.params.id);
        if (result) res.json(result);
        else res.status(404).json({ error: "Request not found" });
    });

    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

    return { app, port };
}

// Auto-start if run directly
import { fileURLToPath as _fileURLToPath } from 'url';
const _isMainModule = process.argv[1] === _fileURLToPath(import.meta.url);

if (_isMainModule) {
    createDashboardServer().then(({ app, port }) => {
        app.listen(port, () => {
            console.log(`Dashboard running at http://localhost:${port}`);
        });
    }).catch(err => console.error(err));
}
