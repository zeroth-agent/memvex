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

    private log(level: string, message: string, ...args: any[]) {
        const extra = args.length ? ' ' + args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ') : '';
        process.stderr.write(`[${level}] ${new Date().toISOString()} - ${this.formatMessage(message)}${extra}\n`);
    }

    debug(message: string, ...args: any[]) {
        if (this.level <= LogLevel.DEBUG) this.log('DEBUG', message, ...args);
    }

    info(message: string, ...args: any[]) {
        if (this.level <= LogLevel.INFO) this.log('INFO', message, ...args);
    }

    warn(message: string, ...args: any[]) {
        if (this.level <= LogLevel.WARN) this.log('WARN', message, ...args);
    }

    error(message: string, ...args: any[]) {
        if (this.level <= LogLevel.ERROR) this.log('ERROR', message, ...args);
    }
}

export const logger = new Logger();
