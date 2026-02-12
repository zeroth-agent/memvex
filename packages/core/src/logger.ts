export enum LogLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR
}

export class Logger {
    private level: LogLevel = LogLevel.INFO;
    private context?: string;

    constructor(context?: string, level: LogLevel = LogLevel.INFO) {
        this.context = context;
        this.level = level;
    }

    private formatMessage(message: string): string {
        return this.context ? `[${this.context}] ${message}` : message;
    }

    debug(message: string, ...args: any[]) {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(`[DEBUG] ${new Date().toISOString()} - ${this.formatMessage(message)}`, ...args);
        }
    }

    info(message: string, ...args: any[]) {
        if (this.level <= LogLevel.INFO) {
            console.info(`[INFO] ${new Date().toISOString()} - ${this.formatMessage(message)}`, ...args);
        }
    }

    warn(message: string, ...args: any[]) {
        if (this.level <= LogLevel.WARN) {
            console.warn(`[WARN] ${new Date().toISOString()} - ${this.formatMessage(message)}`, ...args);
        }
    }

    error(message: string, ...args: any[]) {
        if (this.level <= LogLevel.ERROR) {
            console.error(`[ERROR] ${new Date().toISOString()} - ${this.formatMessage(message)}`, ...args);
        }
    }
}

export const logger = new Logger();
