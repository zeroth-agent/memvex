import { IdentityConfig, Logger } from '@memvex/core';

export class IdentityModule {
    private config: IdentityConfig;
    private logger: Logger;

    constructor(config: IdentityConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    get(path?: string): any {
        if (!path) return this.config;

        // Support dot notation: "coding.style"
        return path.split('.').reduce((obj, key) => obj && obj[key], this.config);
    }

    getAll(): IdentityConfig {
        return this.config;
    }
}
