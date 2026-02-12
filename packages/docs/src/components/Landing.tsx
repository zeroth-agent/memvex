import { useState, useEffect } from "react";

const TYPING_LINES = [
    { agent: "cursor", action: "memvex.identity.get('coding.style')", result: "→ functional, typescript, vitest" },
    { agent: "claude", action: "memvex.memory.recall('project atlas')", result: "→ 3 entries found, latest: 'client prefers detailed proposals'" },
    { agent: "email-agent", action: "memvex.guard.check('send_external_email')", result: "→ ⚠ requires approval — awaiting confirmation" },
];

function TerminalDemo() {
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleLines((prev) => (prev >= TYPING_LINES.length ? 0 : prev + 1));
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                overflow: "hidden",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: "13px",
                maxWidth: "620px",
                margin: "0 auto",
                boxShadow: "0 24px 80px var(--shadow-color), 0 0 0 1px var(--border-light)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "13px 18px",
                    borderBottom: "1px solid var(--border)",
                    background: "var(--bg-term-header)",
                }}
            >
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: "12px", color: "var(--text-muted-2)", fontSize: "12px" }}>
                    memvex — live agent activity
                </span>
            </div>
            <div style={{ padding: "20px 22px", minHeight: "160px" }}>
                {TYPING_LINES.slice(0, visibleLines).map((line, i) => (
                    <div
                        key={i}
                        style={{
                            marginBottom: "16px",
                            animation: "fadeSlideIn 0.4s ease both",
                            animationDelay: `${i * 0.1}s`,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                            <span
                                style={{
                                    fontSize: "10px",
                                    padding: "2px 7px",
                                    borderRadius: "4px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    background:
                                        line.agent === "cursor"
                                            ? "var(--badge-bg-cursor)"
                                            : line.agent === "claude"
                                                ? "var(--badge-bg-claude)"
                                                : "var(--badge-bg-email)",
                                    color:
                                        line.agent === "cursor"
                                            ? "var(--accent-purple)"
                                            : line.agent === "claude"
                                                ? "var(--accent-teal)"
                                                : "var(--accent-yellow)",
                                }}
                            >
                                {line.agent}
                            </span>
                            <span style={{ color: "var(--text-muted)" }}>→</span>
                            <span style={{ color: "var(--text-code)" }}>{line.action}</span>
                        </div>
                        <div style={{ paddingLeft: "4px", color: line.result.includes("⚠") ? "var(--accent-yellow)" : "var(--text-success)", fontSize: "12px" }}>
                            {line.result}
                        </div>
                    </div>
                ))}
                {visibleLines < TYPING_LINES.length && (
                    <span
                        style={{
                            display: "inline-block",
                            width: "8px",
                            height: "16px",
                            background: "var(--accent-teal)",
                            animation: "blink 1s infinite",
                            borderRadius: "1px",
                            verticalAlign: "middle",
                        }}
                    />
                )}
            </div>
        </div>
    );
}

interface ModuleCardProps {
    icon: string;
    name: string;
    tagline: string;
    description: string;
    commands: string[];
    color: string;
    delay: number;
}

function ModuleCard({ icon, name, tagline, description, commands, color, delay }: ModuleCardProps) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered
                    ? `linear-gradient(135deg, ${color}15 0%, var(--bg-card-hover) 60%)`
                    : "var(--bg-card)",
                border: `1px solid ${hovered ? color + "40" : "var(--border)"}`,
                borderRadius: "16px",
                padding: "32px 28px",
                transition: "all 0.35s ease",
                cursor: "default",
                flex: "1 1 280px",
                minWidth: "260px",
                animation: "fadeSlideUp 0.6s ease both",
                animationDelay: `${delay}s`,
                boxShadow: hovered ? `0 10px 40px -10px ${color}20` : "none",
            }}
        >
            <div
                style={{
                    fontSize: "32px",
                    marginBottom: "16px",
                    width: "56px",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "14px",
                    background: `${color}15`,
                    border: `1px solid ${color}25`,
                }}
            >
                {icon}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>
                    {name}
                </h3>
            </div>
            <div
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: color,
                    marginBottom: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                }}
            >
                {tagline}
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.65", margin: "0 0 18px" }}>
                {description}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {commands.map((cmd, i) => (
                    <div
                        key={i}
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "11.5px",
                            color: "var(--text-muted)",
                            background: "var(--bg-code-block)",
                            padding: "7px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-code)",
                        }}
                    >
                        <span style={{ color: color, opacity: 0.8 }}>$</span> {cmd}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ConfigPreview() {
    const yaml = `identity:
  role: "Founder building AI infra startup"
  communication:
    team: casual, direct, emoji-friendly
    clients: professional, concise
    investors: data-driven, confident
  coding:
    lang: typescript
    style: functional
    tests: vitest, integration-first
  schedule:
    no_meetings_before: "10:00"
    focus: ["Tue 9-12", "Thu 9-12"]

memory:
  store: local          # sqlite, local-first
  retention: 90d        # auto-expire old entries
  namespaces: [work, personal, side-projects]

guard:
  rules:
    - spend_money:
        max_auto: $50
        notify_above: $20
    - send_external:
        require_approval: true
    - modify_production:
        blocked: true`;

    return (
        <div
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                overflow: "hidden",
                maxWidth: "540px",
                margin: "0 auto",
                boxShadow: "0 16px 60px var(--shadow-color)",
            }}
        >
            <div
                style={{
                    padding: "12px 18px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--bg-term-header)",
                }}
            >
                <span
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                    }}
                >
                    memvex.yaml
                </span>
                <span
                    style={{
                        fontSize: "10px",
                        color: "var(--accent-teal)",
                        background: "var(--badge-bg-claude)",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                    }}
                >
                    your entire config
                </span>
            </div>
            <pre
                style={{
                    margin: 0,
                    padding: "20px 22px",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontSize: "12px",
                    lineHeight: "1.7",
                    color: "var(--text-code-dim)",
                    overflowX: "auto",
                    whiteSpace: "pre",
                }}
            >
                {yaml.split("\n").map((line, i) => {
                    const isKey = line.includes(":") && !line.trim().startsWith("-") && !line.trim().startsWith("#");
                    const isComment = line.trim().startsWith("#");
                    const isDash = line.trim().startsWith("-");

                    if (isComment) {
                        return (
                            <div key={i}>
                                <span style={{ color: "var(--text-comment)" }}>{line}</span>
                            </div>
                        );
                    }
                    if (isDash) {
                        const parts = line.split(":");
                        return (
                            <div key={i}>
                                <span style={{ color: "var(--accent-yellow)" }}>{parts[0]}</span>
                                {parts.length > 1 && <span style={{ color: "var(--text-muted)" }}>:</span>}
                                {parts.length > 1 && <span style={{ color: "var(--text-code-dim)" }}>{parts.slice(1).join(":")}</span>}
                            </div>
                        );
                    }
                    if (isKey) {
                        const [key, ...rest] = line.split(":");
                        const value = rest.join(":");
                        return (
                            <div key={i}>
                                <span style={{ color: "var(--accent-teal)" }}>{key}</span>
                                <span style={{ color: "var(--text-muted)" }}>:</span>
                                <span style={{ color: value.includes('"') ? "var(--accent-purple)" : "var(--text-code-val)" }}>{value}</span>
                            </div>
                        );
                    }
                    return <div key={i}>{line}</div>;
                })}
            </pre>
        </div>
    );
}

function HowItWorks() {
    const steps = [
        {
            num: "01",
            title: "Install & init",
            desc: "One command. Creates memvex.yaml and starts the MCP server locally.",
            code: "npx memvex init",
        },
        {
            num: "02",
            title: "Define yourself",
            desc: "Edit memvex.yaml with your preferences, rules, and context. Or use the web UI.",
            code: "vim memvex.yaml",
        },
        {
            num: "03",
            title: "Point your agents",
            desc: "Add Memvex as an MCP server in Claude, Cursor, or any MCP-compatible tool.",
            code: '{ "mcpServers": { "memvex": { "command": "memvex serve" } } }',
        },
        {
            num: "04",
            title: "Agents know you",
            desc: "Every agent now queries your identity, shares memory, and respects your guardrails.",
            code: "# That's it. Seriously.",
        },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {steps.map((step, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        gap: "24px",
                        alignItems: "flex-start",
                        padding: "24px 0",
                        borderBottom: i < steps.length - 1 ? "1px solid var(--border-dim)" : "none",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "var(--text-steps)",
                            lineHeight: 1,
                            minWidth: "50px",
                        }}
                    >
                        {step.num}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
                            {step.title}
                        </h4>
                        <p style={{ margin: "0 0 12px", fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                            {step.desc}
                        </p>
                        <div
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "12px",
                                color: "var(--accent-teal)",
                                background: "var(--bg-code-block)",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid var(--border-code)",
                                display: "inline-block",
                            }}
                        >
                            {step.code}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ThemeToggle({ theme, toggleTheme }: { theme: 'dark' | 'light', toggleTheme: () => void }) {
    return (
        <button
            onClick={toggleTheme}
            style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-muted)",
                transition: "all 0.2s",
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                // Sun icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            ) : (
                // Moon icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            )}
        </button>
    );
}

function NavBar({ theme, toggleTheme }: { theme: 'dark' | 'light', toggleTheme: () => void }) {
    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 32px",
                maxWidth: "1100px",
                margin: "0 auto",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                    style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, var(--accent-teal) 0%, var(--accent-purple) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "#0a0c0f",
                    }}
                >
                    M
                </div>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                    memvex
                </span>
                <span
                    style={{
                        fontSize: "10px",
                        color: "var(--text-muted)",
                        background: "var(--bg-card)",
                        padding: "2px 7px",
                        borderRadius: "4px",
                        fontFamily: "'JetBrains Mono', monospace",
                        border: "1px solid var(--border-dim)",
                    }}
                >
                    v0.1
                </span>
            </div>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                {/* Updated Links: GitHub only for now */}
                <a
                    href="https://github.com/zeroth-agent/memvex"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                        transition: "color 0.2s",
                    }}
                >
                    GitHub
                </a>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                <div
                    style={{
                        padding: "8px 18px",
                        borderRadius: "8px",
                        background: "var(--button-bg)",
                        color: "var(--button-text)",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    Get Started
                </div>
            </div>
        </nav>
    );
}

export default function Landing() {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div
            className={theme}
            style={{
                fontFamily: "'Instrument Sans', -apple-system, sans-serif",
                background: "var(--bg-main)",
                color: "var(--text-main)",
                minHeight: "100vh",
                overflowX: "hidden",
                transition: "background 0.3s ease, color 0.3s ease",
            }}
        >
            <link
                href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
            <style>{`
        :root {
          /* Dark Mode (Default) */
          --bg-main: #08090c;
          --bg-card: #0d0f14;
          --bg-card-hover: #0d0f14;
          --bg-term-header: #0d0f14;
          --bg-code-block: #080a0e;
          
          --border: #1a1d25;
          --border-light: rgba(255,255,255,0.03);
          --border-dim: #12141a;
          --border-code: #12141a;
          
          --text-main: #e8eaed;
          --text-secondary: #6b7280;
          --text-muted: #4a5068;
          --text-muted-2: #3d4250;
          --text-dim: #8a90a0;
          --text-code: #c0c7d6;
          --text-code-dim: #8a90a0;
          --text-code-val: #c0c7d6;
          --text-comment: #3a3f50;
          --text-steps: #1a1d25;
          --text-success: #5a6a5a;
          
          --accent-teal: #4ecdc4;
          --accent-purple: #a78bfa;
          --accent-yellow: #e8b44d;
          --accent-red: #ff5f57;
          --accent-green: #28c840;
          
          --badge-bg-cursor: #1a1530;
          --badge-bg-claude: #0f1f1c;
          --badge-bg-email: #1f1a10;
          
          --button-bg: #e8eaed;
          --button-text: #0a0c0f;
          
          --shadow-color: rgba(0,0,0,0.5);
          --glow-color: rgba(78, 205, 196, 0.06);
        }

        .light {
          /* Light Mode Overrides */
          --bg-main: #faf9f6;
          --bg-card: #ffffff;
          --bg-card-hover: #ffffff;
          --bg-term-header: #f8fafc;
          --bg-code-block: #f1f5f9;
          
          --border: #e2e8f0;
          --border-light: rgba(0,0,0,0.05);
          --border-dim: #e2e8f0;
          --border-code: #e2e8f0;
          
          --text-main: #0f172a;
          --text-secondary: #475569;
          --text-muted: #94a3b8;
          --text-muted-2: #64748b;
          --text-dim: #64748b;
          --text-code: #334155;
          --text-code-dim: #64748b;
          --text-code-val: #334155;
          --text-comment: #94a3b8;
          --text-steps: #f1f5f9;
          --text-success: #059669;
          
          --accent-teal: #0d9488;
          --accent-purple: #7c3aed;
          --accent-yellow: #d97706;
          
          --badge-bg-cursor: #f3e8ff;
          --badge-bg-claude: #ccfbf1;
          --badge-bg-email: #fef3c7;
          
          --button-bg: #0f172a;
          --button-text: #ffffff;
          
          --shadow-color: rgba(0,0,0,0.1);
          --glow-color: rgba(13, 148, 136, 0.1);
        }
        
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>

            <NavBar theme={theme} toggleTheme={toggleTheme} />

            {/* Hero */}
            <section
                style={{
                    textAlign: "center",
                    padding: "80px 24px 60px",
                    maxWidth: "800px",
                    margin: "0 auto",
                    position: "relative",
                }}
            >
                {/* Subtle glow behind hero */}
                <div
                    style={{
                        position: "absolute",
                        top: "-40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "600px",
                        height: "300px",
                        background: "radial-gradient(ellipse, var(--glow-color) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 14px 6px 8px",
                        borderRadius: "20px",
                        border: "1px solid var(--border)",
                        background: "var(--bg-card)",
                        marginBottom: "32px",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                    }}
                >
                    <span
                        style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "var(--accent-teal)",
                            animation: "pulse 2s infinite",
                            display: "inline-block",
                        }}
                    />
                    Open source · MCP-native · Local-first
                </div>

                <h1
                    style={{
                        fontSize: "clamp(36px, 6vw, 64px)",
                        fontWeight: 700,
                        lineHeight: 1.08,
                        letterSpacing: "-0.04em",
                        margin: "0 0 24px",
                    }}
                >
                    Your agents don't
                    <br />
                    know you.{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, var(--accent-teal), var(--accent-purple))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundSize: "200% 200%",
                            animation: "gradientShift 4s ease infinite",
                        }}
                    >
                        Memvex fixes that.
                    </span>
                </h1>
                <p
                    style={{
                        fontSize: "18px",
                        color: "var(--text-secondary)",
                        maxWidth: "520px",
                        margin: "0 auto 40px",
                        lineHeight: "1.6",
                    }}
                >
                    One MCP server that gives every AI agent your identity,
                    shared memory, and action guardrails. Install once,
                    every agent gets smarter.
                </p>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            padding: "12px 20px",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "14px",
                            color: "var(--accent-teal)",
                            cursor: "pointer",
                        }}
                    >
                        <span style={{ color: "var(--text-muted)" }}>$</span>
                        npx memvex init
                        <span style={{ color: "var(--text-muted)", fontSize: "12px", marginLeft: "4px" }}>📋</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "var(--button-bg)",
                            borderRadius: "10px",
                            padding: "12px 24px",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "var(--button-text)",
                            cursor: "pointer",
                        }}
                    >
                        ★ Star on GitHub
                    </div>
                </div>
            </section>

            {/* Terminal Demo */}
            <section style={{ padding: "20px 24px 80px", maxWidth: "700px", margin: "0 auto" }}>
                <TerminalDemo />
            </section>

            {/* Three Modules */}
            <section style={{ padding: "40px 24px 80px", maxWidth: "1050px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h2
                        style={{
                            fontSize: "clamp(24px, 4vw, 36px)",
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            margin: "0 0 12px",
                        }}
                    >
                        Three modules. One server.
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "480px", margin: "0 auto" }}>
                        Identity, memory, and guardrails — the three things every agent needs but none of them have.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <ModuleCard
                        icon="🪪"
                        name="Identity"
                        tagline="memvex/identity"
                        description="Your preferences, context, and rules — queryable by any agent. Define your coding style, communication tone, schedule constraints, and project context once."
                        commands={[
                            "memvex.identity.get('coding.style')",
                            "memvex.identity.get('communication.clients')",
                        ]}
                        color="var(--accent-teal)"
                        delay={0.1}
                    />
                    <ModuleCard
                        icon="🧠"
                        name="Memory"
                        tagline="memvex/memory"
                        description="Shared knowledge layer across all your agents. Agent A learns something, Agent B knows it. Persistent context that compounds over time."
                        commands={[
                            "memvex.memory.store('client:alex likes detail')",
                            "memvex.memory.recall('project atlas')",
                        ]}
                        color="var(--accent-purple)"
                        delay={0.2}
                    />
                    <ModuleCard
                        icon="🛡️"
                        name="Guard"
                        tagline="memvex/guard"
                        description="Action rules and guardrails. Before any agent takes a consequential action, it checks Guard. Set spend limits, require approvals, block risky actions."
                        commands={[
                            "memvex.guard.check('spend', {amount: 75})",
                            "memvex.guard.check('send_external_email')",
                        ]}
                        color="var(--accent-yellow)"
                        delay={0.3}
                    />
                </div>
            </section>

            {/* Config Preview */}
            <section style={{ padding: "40px 24px 80px", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h2
                        style={{
                            fontSize: "clamp(24px, 4vw, 36px)",
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            margin: "0 0 12px",
                        }}
                    >
                        One config file. That's your whole setup.
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "460px", margin: "0 auto" }}>
                        Define who you are, what agents should remember, and what they're not allowed to do.
                    </p>
                </div>
                <ConfigPreview />
            </section>

            {/* How it works */}
            <section style={{ padding: "40px 24px 80px", maxWidth: "640px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h2
                        style={{
                            fontSize: "clamp(24px, 4vw, 36px)",
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            margin: "0 0 12px",
                        }}
                    >
                        Up and running in 2 minutes
                    </h2>
                </div>
                <HowItWorks />
            </section>

            {/* Compatible with */}
            <section style={{ padding: "40px 24px 80px", maxWidth: "700px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <h2
                        style={{
                            fontSize: "clamp(20px, 3vw, 28px)",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            margin: "0 0 10px",
                        }}
                    >
                        Works with everything MCP-compatible
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>And anything that can make an HTTP call.</p>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                    }}
                >
                    {["Claude", "Cursor", "Windsurf", "Cline", "Custom Agents", "Any MCP Client"].map((name) => (
                        <div
                            key={name}
                            style={{
                                padding: "12px 22px",
                                borderRadius: "10px",
                                border: "1px solid var(--border)",
                                background: "var(--bg-card)",
                                fontSize: "14px",
                                color: "var(--text-secondary)",
                                fontWeight: 500,
                            }}
                        >
                            {name}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section
                style={{
                    padding: "80px 24px",
                    textAlign: "center",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        bottom: "0",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "700px",
                        height: "300px",
                        background: "radial-gradient(ellipse, rgba(167, 139, 250, 0.05) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />
                <h2
                    style={{
                        fontSize: "clamp(28px, 5vw, 44px)",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        margin: "0 0 16px",
                        lineHeight: 1.1,
                    }}
                >
                    Give your agents
                    <br />a brain they share.
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "32px" }}>
                    Open source. Local-first. MCP-native. Always free.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            padding: "14px 24px",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "14px",
                            color: "var(--accent-teal)",
                            cursor: "pointer",
                        }}
                    >
                        <span style={{ color: "var(--text-muted)" }}>$</span>
                        npx memvex init
                    </div>
                    <div
                        style={{
                            padding: "14px 28px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, var(--accent-teal), var(--accent-purple))",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "var(--button-text)",
                            cursor: "pointer",
                        }}
                    >
                        Read the Docs →
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                style={{
                    borderTop: "1px solid var(--border-dim)",
                    padding: "28px 32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    maxWidth: "1100px",
                    margin: "0 auto",
                    flexWrap: "wrap",
                    gap: "12px",
                }}
            >
                <div style={{ color: "var(--text-muted-2)", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>
                    memvex · built by{" "}
                    <span style={{ color: "var(--text-muted)" }}>zeroth-agent</span> · hosted on{" "}
                    <span style={{ color: "var(--accent-teal)" }}>zerothagent.com</span>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                    {/* GitHub only */}
                    <a
                        href="https://github.com/zeroth-agent/memvex"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "13px" }}
                    >
                        GitHub
                    </a>
                </div>
            </footer>
        </div>
    );
}
