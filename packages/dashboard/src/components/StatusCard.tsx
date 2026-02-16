import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
}

export function StatusCard({ label, value, icon: Icon, color = "text-primary" }: StatusCardProps) {
    return (
        <div className="glass-card flex items-center gap-4">
            <div className={`p-3 rounded-full bg-surfaceHighlight ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <div className="text-2xl font-bold text-text">{value}</div>
                <div className="text-sm text-textMuted">{label}</div>
            </div>
        </div>
    );
}
