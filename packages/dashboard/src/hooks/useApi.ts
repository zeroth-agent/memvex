import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api';

export function useStatus() {
    const [status, setStatus] = useState<any>(null);
    useEffect(() => {
        fetch(`${API_BASE}/status`)
            .then(res => res.json())
            .then(setStatus)
            .catch(console.error);
    }, []);
    return status;
}

export function useIdentity() {
    const [identity, setIdentity] = useState<any>(null);
    useEffect(() => {
        fetch(`${API_BASE}/identity`)
            .then(res => res.json())
            .then(setIdentity)
            .catch(console.error);
    }, []);
    return identity;
}

export function useMemories(query: string = '', namespace: string = '') {
    const [memories, setMemories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMemories = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (namespace) params.append('ns', namespace);

        fetch(`${API_BASE}/memory?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setMemories(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [query, namespace]);

    useEffect(() => {
        const timeout = setTimeout(fetchMemories, 300); // Debounce
        return () => clearTimeout(timeout);
    }, [fetchMemories]);

    const deleteMemory = async (id: string) => {
        await fetch(`${API_BASE}/memory/${id}`, { method: 'DELETE' });
        fetchMemories();
    };

    return { memories, loading, deleteMemory, refresh: fetchMemories };
}

export function useApprovals() {
    const [pending, setPending] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);

    const fetchPending = () => {
        fetch(`${API_BASE}/guard/pending`)
            .then(res => res.json())
            .then(setPending)
            .catch(console.error);
    };

    const fetchHistory = () => {
        fetch(`${API_BASE}/guard/history`)
            .then(res => res.json())
            .then(setHistory)
            .catch(console.error);
    };

    useEffect(() => {
        fetchPending();
        fetchHistory();
        const interval = setInterval(fetchPending, 2000); // Poll every 2s
        return () => clearInterval(interval);
    }, []);

    const approve = async (id: string) => {
        await fetch(`${API_BASE}/guard/approve/${id}`, { method: 'POST' });
        fetchPending();
        fetchHistory();
    };

    const deny = async (id: string) => {
        await fetch(`${API_BASE}/guard/deny/${id}`, { method: 'POST' });
        fetchPending();
        fetchHistory();
    };

    return { pending, history, approve, deny };
}
