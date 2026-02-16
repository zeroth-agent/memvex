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
                background: "#0a0c10",
                border: "1px solid #1a1d25",
                borderRadius: "14px",
                overflow: "hidden",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: "13px",
                maxWidth: "620px",
                margin: "0 auto",
                boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "13px 18px",
                    borderBottom: "1px solid #1a1d25",
                    background: "#0d0f14",
                }}
            >
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: "12px", color: "#3d4250", fontSize: "12px" }}>
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
                                            ? "#1a1530"
                                            : line.agent === "claude"
                                                ? "#0f1f1c"
                                                : "#1f1a10",
                                    color:
                                        line.agent === "cursor"
                                            ? "#a78bfa"
                                            : line.agent === "claude"
                                                ? "#4ecdc4"
                                                : "#e8b44d",
                                }}
                            >
                                {line.agent}
                            </span>
                            <span style={{ color: "#4a5068" }}>→</span>
                            <span style={{ color: "#c0c7d6" }}>{line.action}</span>
                        </div>
                        <div style={{ paddingLeft: "4px", color: line.result.includes("⚠") ? "#e8b44d" : "#5a6a5a", fontSize: "12px" }}>
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
                            background: "#4ecdc4",
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

function ModuleCard({ icon, name, tagline, description, commands, color, delay }: any) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered
                    ? `linear-gradient(135deg, ${color}08 0%, #0d0f14 60%)`
                    : "#0d0f14",
                border: `1px solid ${hovered ? color + "30" : "#1a1d25"}`,
                borderRadius: "16px",
                padding: "32px 28px",
                transition: "all 0.35s ease",
                cursor: "default",
                flex: "1 1 280px",
                minWidth: "260px",
                animation: "fadeSlideUp 0.6s ease both",
                animationDelay: `${delay}s`,
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
                    background: `${color}10`,
                    border: `1px solid ${color}20`,
                }}
            >
                {icon}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "#e8eaed" }}>
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
            <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.65", margin: "0 0 18px" }}>
                {description}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {commands.map((cmd: string, i: number) => (
                    <div
                        key={i}
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "11.5px",
                            color: "#4a5068",
                            background: "#080a0e",
                            padding: "7px 12px",
                            borderRadius: "6px",
                            border: "1px solid #12141a",
                        }}
                    >
                        <span style={{ color: color, opacity: 0.7 }}>$</span> {cmd}
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
                background: "#0a0c10",
                border: "1px solid #1a1d25",
                borderRadius: "14px",
                overflow: "hidden",
                maxWidth: "540px",
                margin: "0 auto",
                boxShadow: "0 16px 60px rgba(0,0,0,0.4)",
            }}
        >
            <div
                style={{
                    padding: "12px 18px",
                    borderBottom: "1px solid #1a1d25",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#0d0f14",
                }}
            >
                <span
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        color: "#4a5068",
                    }}
                >
                    memvex.yaml
                </span>
                <span
                    style={{
                        fontSize: "10px",
                        color: "#4ecdc4",
                        background: "#0f1f1c",
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
                    color: "#8a90a0",
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
                                <span style={{ color: "#3a3f50" }}>{line}</span>
                            </div>
                        );
                    }
                    if (isDash) {
                        const parts = line.split(":");
                        return (
                            <div key={i}>
                                <span style={{ color: "#e8b44d" }}>{parts[0]}</span>
                                {parts.length > 1 && <span style={{ color: "#4a5068" }}>:</span>}
                                {parts.length > 1 && <span style={{ color: "#8a90a0" }}>{parts.slice(1).join(":")}</span>}
                            </div>
                        );
                    }
                    if (isKey) {
                        const [key, ...rest] = line.split(":");
                        const value = rest.join(":");
                        return (
                            <div key={i}>
                                <span style={{ color: "#4ecdc4" }}>{key}</span>
                                <span style={{ color: "#4a5068" }}>:</span>
                                <span style={{ color: value.includes('"') ? "#a78bfa" : "#c0c7d6" }}>{value}</span>
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
                        borderBottom: i < steps.length - 1 ? "1px solid #12141a" : "none",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "#1a1d25",
                            lineHeight: 1,
                            minWidth: "50px",
                        }}
                    >
                        {step.num}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: 700, color: "#e8eaed" }}>
                            {step.title}
                        </h4>
                        <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
                            {step.desc}
                        </p>
                        <div
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "12px",
                                color: "#4ecdc4",
                                background: "#080a0e",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid #12141a",
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

function NavBar() {
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
                        background: "linear-gradient(135deg, #4ecdc4 0%, #a78bfa 100%)",
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
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#e8eaed", letterSpacing: "-0.02em" }}>
                    memvex
                </span>
                <span
                    style={{
                        fontSize: "10px",
                        color: "#4a5068",
                        background: "#12141a",
                        padding: "2px 7px",
                        borderRadius: "4px",
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    v0.1.1
                </span>
            </div>
            <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
                {["Docs", "GitHub", "Examples"].map((link) => (
                    <a
                        key={link}
                        href="#"
                        style={{
                            color: "#6b7280",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: 500,
                            transition: "color 0.2s",
                        }}
                    >
                        {link}
                    </a>
                ))}
                <div
                    style={{
                        padding: "8px 18px",
                        borderRadius: "8px",
                        background: "#e8eaed",
                        color: "#0a0c0f",
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

export default function App() {
    return (
        <div
            style={{
                fontFamily: "'Instrument Sans', -apple-system, sans-serif",
                background: "#08090c",
                color: "#e8eaed",
                minHeight: "100vh",
                overflowX: "hidden",
            }}
        >
            <link
                href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

            <NavBar />

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
                        background: "radial-gradient(ellipse, rgba(78, 205, 196, 0.06) 0%, transparent 70%)",
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
                        border: "1px solid #1a1d25",
                        background: "#0d0f14",
                        marginBottom: "32px",
                        fontSize: "13px",
                        color: "#6b7280",
                    }}
                >
                    <span
                        style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "#4ecdc4",
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
                            background: "linear-gradient(135deg, #4ecdc4, #a78bfa)",
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
                        color: "#6b7280",
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
                            background: "#0d0f14",
                            border: "1px solid #1a1d25",
                            borderRadius: "10px",
                            padding: "12px 20px",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "14px",
                            color: "#4ecdc4",
                            cursor: "pointer",
                        }}
                    >
                        <span style={{ color: "#4a5068" }}>$</span>
                        npx memvex init
                        <span style={{ color: "#4a5068", fontSize: "12px", marginLeft: "4px" }}>📋</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "#e8eaed",
                            borderRadius: "10px",
                            padding: "12px 24px",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#0a0c0f",
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
                    <p style={{ color: "#6b7280", fontSize: "16px", maxWidth: "480px", margin: "0 auto" }}>
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
                        color="#4ecdc4"
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
                        color="#a78bfa"
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
                        color="#e8b44d"
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
                    <p style={{ color: "#6b7280", fontSize: "16px", maxWidth: "460px", margin: "0 auto" }}>
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
                    <p style={{ color: "#4a5068", fontSize: "14px" }}>And anything that can make an HTTP call.</p>
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
                                border: "1px solid #1a1d25",
                                background: "#0d0f14",
                                fontSize: "14px",
                                color: "#6b7280",
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
                <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "32px" }}>
                    Open source. Local-first. MCP-native. Always free.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "#0d0f14",
                            border: "1px solid #1a1d25",
                            borderRadius: "10px",
                            padding: "14px 24px",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "14px",
                            color: "#4ecdc4",
                            cursor: "pointer",
                        }}
                    >
                        <span style={{ color: "#4a5068" }}>$</span>
                        npx memvex init
                    </div>
                    <div
                        style={{
                            padding: "14px 28px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #4ecdc4, #a78bfa)",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#0a0c0f",
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
                    borderTop: "1px solid #12141a",
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
                <div style={{ color: "#2a2e38", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>
                    memvex · built by{" "}
                    <span style={{ color: "#4a5068" }}>[your name]</span> · hosted on{" "}
                    <span style={{ color: "#4ecdc4" }}>memvex.dev</span>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                    {["GitHub", "Twitter", "Discord"].map((link) => (
                        <a
                            key={link}
                            href="#"
                            style={{ color: "#3a3f49", textDecoration: "none", fontSize: "13px" }}
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
}
