export class MemvexError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ConfigError extends MemvexError {
    constructor(message: string) {
        super(`Config Error: ${message}`);
    }
}

export class GuardBlockedError extends MemvexError {
    constructor(reason: string) {
        super(`Guard Blocked: ${reason}`);
    }
}

export class MemoryNotFoundError extends MemvexError {
    constructor(id: string) {
        super(`Memory not found: ${id}`);
    }
}
