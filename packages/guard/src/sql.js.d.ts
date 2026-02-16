// Type declarations for sql.js
declare module 'sql.js' {
    export interface SqlJsConfig {
        locateFile?: (filename: string) => string;
    }

    export interface Database {
        exec(sql: string): void;
        run(sql: string, params?: any[]): void;
        prepare(sql: string): Statement;
        export(): Uint8Array;
        close(): void;
        getRowsModified(): number;
    }

    export interface Statement {
        bind(values?: any[]): boolean;
        step(): boolean;
        get(): any;
        getAsObject(): any;
        free(): void;
    }

    export interface SqlJsStatic {
        Database: {
            new(): Database;
            new(data: ArrayLike<number>): Database;
        };
    }

    export default function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;
}
