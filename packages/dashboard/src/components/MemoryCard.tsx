import { Trash2, Tag, Calendar } from 'lucide-react';

interface MemoryCardProps {
    memory: any;
    onDelete: (id: string) => void;
}

export function MemoryCard({ memory, onDelete }: MemoryCardProps) {
    return (
        <div className="glass-card group relative">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-xs text-textMuted font-mono">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {memory.namespace || 'default'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(memory.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                </div>
                <button
                    onClick={() => onDelete(memory.id)}
                    className="text-textMuted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <p className="text-text mb-3 leading-relaxed">
                {memory.content}
            </p>

            {memory.tags && memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                    {memory.tags.map((tag: string) => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-textMuted bg-surfaceHighlight px-2 py-1 rounded-full">
                            <Tag size={10} />
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
