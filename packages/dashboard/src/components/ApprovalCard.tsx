import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface ApprovalCardProps {
    request: any;
    onApprove?: (id: string) => void;
    onDeny?: (id: string) => void;
    readonly?: boolean;
}

export function ApprovalCard({ request, onApprove, onDeny, readonly = false }: ApprovalCardProps) {
    const isPending = request.status === 'pending';

    return (
        <div className={`glass-card border-l-4 ${request.status === 'approved' ? 'border-l-green-500' :
                request.status === 'denied' ? 'border-l-red-500' :
                    'border-l-yellow-500'
            }`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold uppercase tracking-wider text-text">
                            {request.action}
                        </span>
                        {isPending && (
                            <span className="flex items-center gap-1 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                <Clock size={12} /> Pending
                            </span>
                        )}
                        {!isPending && (
                            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${request.status === 'approved' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'
                                }`}>
                                {request.status === 'approved' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                {request.status}
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-textMuted mb-2">
                        Agent: <span className="text-text">{request.agent || 'Unknown'}</span>
                    </div>
                </div>
                <div className="text-xs text-textMuted font-mono">
                    {new Date(request.createdAt).toLocaleTimeString()}
                </div>
            </div>

            {request.params && Object.keys(request.params).length > 0 && (
                <div className="bg-surfaceHighlight/50 p-2 rounded text-xs font-mono text-textMuted mb-4 overflow-x-auto">
                    {JSON.stringify(request.params, null, 2)}
                </div>
            )}

            {isPending && !readonly && onApprove && onDeny && (
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => onApprove(request.id)}
                        className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-500 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                    >
                        <CheckCircle size={16} /> Approve
                    </button>
                    <button
                        onClick={() => onDeny(request.id)}
                        className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-500 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                    >
                        <XCircle size={16} /> Deny
                    </button>
                </div>
            )}

            {request.reason && (
                <div className="mt-2 text-xs text-textMuted flex items-start gap-1">
                    <AlertTriangle size={12} className="mt-0.5" />
                    {request.reason}
                </div>
            )}
        </div>
    );
}
