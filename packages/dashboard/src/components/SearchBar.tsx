import { Search } from 'lucide-react';

interface SearchBarProps {
    query: string;
    setQuery: (q: string) => void;
    namespace: string;
    setNamespace: (ns: string) => void;
}

export function SearchBar({ query, setQuery, namespace, setNamespace }: SearchBarProps) {
    return (
        <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search memories..."
                    className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-2 text-text focus:outline-none focus:border-primary transition-colors placeholder:text-textMuted/50"
                />
            </div>
            <select
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors appearance-none min-w-[150px]"
            >
                <option value="">All Namespaces</option>
                <option value="default">Default</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
            </select>
        </div>
    );
}
