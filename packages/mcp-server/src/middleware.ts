export const requestLogger = (req: any, next: () => void) => {
    console.log(`[MCP] Request: ${req.method} ${req.url}`);
    next();
};

export const authMiddleware = (token: string) => {
    return (req: any, next: () => void) => {
        // Placeholder for actual auth logic
        if (req.headers['authorization'] !== `Bearer ${token}`) {
            throw new Error("Unauthorized");
        }
        next();
    };
};
