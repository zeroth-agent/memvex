export interface MemvexConfig {
    identity: IdentityConfig;
    memory?: MemoryConfig;
    guard?: GuardConfig;
}

export interface IdentityConfig {
    name: string;
    role: string;
    communication?: Record<string, string>;
    coding?: Record<string, string>;
    scheduling?: Record<string, any>;
    [key: string]: any;
}

export interface MemoryConfig {
    enabled: boolean;
    storage: 'sqlite' | 'memory';
    path?: string;
}

export interface GuardConfig {
    enabled: boolean;
    persist?: boolean;
    rules: GuardRule[];
}

export interface GuardRule {
    action: string;
    max?: number;
    require_approval?: boolean;
    require_approval_above?: number;
    blocked?: boolean;
    message?: string;
}

export interface MemvexEvent {
    type: 'config_loaded' | 'action_blocked' | 'action_approved' | 'memory_stored';
    payload: any;
    timestamp: string;
}
