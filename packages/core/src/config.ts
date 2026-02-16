import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { MemvexConfig } from './types.js';

export class ConfigLoader {
    private configPath: string;

    constructor(configPath?: string) {
        this.configPath = configPath || process.env.MEMVEX_CONFIG || path.join(process.cwd(), 'memvex.yaml');
    }

    load(): MemvexConfig {
        if (!fs.existsSync(this.configPath)) {
            throw new Error(`Config file not found at ${this.configPath}. Run 'memvex init' first.`);
        }

        try {
            const fileContents = fs.readFileSync(this.configPath, 'utf8');
            const config = yaml.load(fileContents) as MemvexConfig;
            return config;
        } catch (e: any) {
            throw new Error(`Failed to parse config file: ${e.message}`);
        }
    }
}
