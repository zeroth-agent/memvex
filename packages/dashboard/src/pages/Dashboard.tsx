import { useState } from 'react';
import { Brain, Shield, User, Activity, LayoutDashboard } from 'lucide-react';
import { useStatus, useIdentity, useApprovals, useMemories } from '../hooks/useApi';
import { ThemeToggle } from '../components/ThemeToggle';
import { StatusCard } from '../components/StatusCard';
import { MemoryCard } from '../components/MemoryCard';
import { ApprovalCard } from '../components/ApprovalCard';
import { SearchBar } from '../components/SearchBar';


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [memoryQuery, setMemoryQuery] = useState('');
    const [memoryNamespace, setMemoryNamespace] = useState('');

    // Data hooks
    const status = useStatus();
    const identity = useIdentity();
    const { memories, deleteMemory } = useMemories(memoryQuery, memoryNamespace);
    const { pending, history, approve, deny } = useApprovals();

    // Stats calculation
    const memoryCount = memories.length; // Approximate if paged
    const pendingCount = pending.length;

    const renderSidebar = () => (
        <div className="w-64 bg-surface border-r border-white/5 p-6 flex flex-col h-screen fixed left-0 top-0">
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-bold text-black">
                    M
                </div>
                <span className="font-bold text-lg text-text">memvex</span>
            </div>

            <nav className="flex-1 space-y-1">
                <SidebarItem
                    icon={LayoutDashboard}
                    label="Overview"
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                />
                <SidebarItem
                    icon={Brain}
                    label="Memory"
                    active={activeTab === 'memory'}
                    onClick={() => setActiveTab('memory')}
                />
                <SidebarItem
                    icon={Shield}
                    label="Guard"
                    active={activeTab === 'guard'}
                    onClick={() => setActiveTab('guard')}
                    badge={pendingCount > 0 ? pendingCount : undefined}
                />
                <SidebarItem
                    icon={User}
                    label="Identity"
                    active={activeTab === 'identity'}
                    onClick={() => setActiveTab('identity')}
                />
            </nav>

            <div className="border-t border-white/5 pt-4 mt-auto">
                <div className="flex justify-between items-center px-2">
                    <span className="text-xs text-textMuted font-mono">v0.1.1</span>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );

    const renderOverview = () => (
        <div className="p-8 space-y-8 animate-fadeSlideIn">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">System Overview</h1>
                <p className="text-textMuted">Operational status for all Memvex modules.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard
                    label="Active Memories"
                    value={memoryCount}
                    icon={Brain}
                    color="text-purple-500"
                />
                <StatusCard
                    label="Pending Approvals"
                    value={pendingCount}
                    icon={Shield}
                    color={pendingCount > 0 ? "text-yellow-500" : "text-green-500"}
                />
                <StatusCard
                    label="Identity Loaded"
                    value={identity ? "Active" : "Loading..."}
                    icon={User}
                    color="text-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-text flex items-center gap-2">
                        <Activity size={20} /> Recent Activity
                    </h2>
                    {history.length === 0 && memories.length === 0 ? (
                        <div className="p-8 bg-surface/30 rounded-xl text-center text-textMuted">
                            No recent activity recorded.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.slice(0, 3).map((req: any) => (
                                <ApprovalCard key={req.id} request={req} readonly />
                            ))}
                            {memories.slice(0, 3).map((mem: any) => (
                                <div key={mem.id} className="glass-card py-3 px-4 flex justify-between">
                                    <div className="truncate text-sm text-text pr-4">{mem.content}</div>
                                    <div className="text-xs text-textMuted font-mono whitespace-nowrap">
                                        {new Date(mem.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-text flex items-center gap-2">
                        <Shield size={20} /> Pending Actions
                    </h2>
                    {pending.length === 0 ? (
                        <div className="p-8 bg-surface/30 rounded-xl text-center text-textMuted border border-dashed border-white/10">
                            All clear. No pending approvals.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pending.map((req: any) => (
                                <ApprovalCard
                                    key={req.id}
                                    request={req}
                                    onApprove={approve}
                                    onDeny={deny}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderMemory = () => (
        <div className="p-8 h-full flex flex-col animate-fadeSlideIn">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Memory Explorer</h1>
                <p className="text-textMuted">Search and manage your agents' shared knowledge base.</p>
            </header>

            <SearchBar
                query={memoryQuery}
                setQuery={setMemoryQuery}
                namespace={memoryNamespace}
                setNamespace={setMemoryNamespace}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                {memories.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-textMuted">
                        No memories found matching your query.
                    </div>
                ) : (
                    memories.map((mem: any) => (
                        <MemoryCard
                            key={mem.id}
                            memory={mem}
                            onDelete={deleteMemory}
                        />
                    ))
                )}
            </div>
        </div>
    );

    const renderGuard = () => (
        <div className="p-8 space-y-8 animate-fadeSlideIn">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Guard & Approvals</h1>
                <p className="text-textMuted">Review and manage sensitive actions blocked by Memvex Guard.</p>
            </header>

            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-text mb-4">Pending Requests</h2>
                    {pending.length === 0 ? (
                        <div className="p-6 bg-surface/30 rounded-xl text-textMuted">
                            No pending requests.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pending.map((req: any) => (
                                <ApprovalCard
                                    key={req.id}
                                    request={req}
                                    onApprove={approve}
                                    onDeny={deny}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-lg font-bold text-text mb-4">Decision History</h2>
                    {history.length === 0 ? (
                        <div className="p-6 bg-surface/30 rounded-xl text-textMuted">
                            No history available.
                        </div>
                    ) : (
                        <div className="grid gap-4 opacity-75">
                            {history.map((req: any) => (
                                <ApprovalCard key={req.id} request={req} readonly />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderIdentity = () => (
        <div className="p-8 h-full flex flex-col animate-fadeSlideIn">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Identity Configuration</h1>
                <p className="text-textMuted">Your defined persona, preferences, and context (read-only).</p>
            </header>

            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <div className="px-4 py-2 bg-black/20 border-b border-white/5 flex justify-between items-center">
                    <span className="font-mono text-xs text-textMuted">memvex.yaml (loaded from {status?.configPath || 'memory'})</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400">Read Only</span>
                </div>
                <pre className="p-6 font-mono text-sm text-blue-300 overflow-auto max-h-[70vh]">
                    {JSON.stringify(identity, null, 2)}
                </pre>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex font-sans">
            {renderSidebar()}
            <main className="flex-1 ml-64">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'memory' && renderMemory()}
                {activeTab === 'guard' && renderGuard()}
                {activeTab === 'identity' && renderIdentity()}
            </main>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, active, onClick, badge }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${active
                ? 'bg-primary/10 text-primary'
                : 'text-textMuted hover:bg-white/5 hover:text-text'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="font-medium text-sm">{label}</span>
            </div>
            {badge && (
                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {badge}
                </span>
            )}
        </button>
    );
}
