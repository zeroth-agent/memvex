// @memvex/core/src/memvex.ts

import { Logger } from "./logger.js";
import { ConfigError } from "./errors.js";

interface IdentityModule {
    init(): Promise<void>;
}

interface MemoryModule {
    init(): Promise<void>;
}

interface GuardModule {
    init(): Promise<void>;
}

export class Memvex {
    private logger: Logger;
    private identity?: IdentityModule;
    private memory?: MemoryModule;
    private guard?: GuardModule;

    constructor() {
        this.logger = new Logger("memvex");
    }

    async init(configPath: string) {
        this.logger.info(`Initializing Memvex with config: ${configPath}`);

        // TODO: Load config
        // TODO: Initialize Identity Module
        // TODO: Initialize Memory Module
        // TODO: Initialize Guard Module

        this.logger.info("Memvex initialized successfully");
    }

    async shutdown() {
        this.logger.info("Shutting down Memvex...");
        // TODO: Graceful shutdown of modules
    }
}
