export const IDENTITY_TOOLS = [
    {
        name: "identity_get",
        description: "Get user identity or preference by path (e.g. 'coding.style'). Returns full config if no path provided.",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Dot-notation path to config value (e.g. 'communication.style')"
                }
            }
        }
    }
];
