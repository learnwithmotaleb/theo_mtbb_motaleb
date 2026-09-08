import { useState } from 'react';

export const useRefresh = (refetches: (() => Promise<any>)[]) => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all(
                refetches.map(fn => {
                    try {
                        return fn(); 
                    } catch {
                        return Promise.resolve(); 
                    }
                })
            );
        } finally {
            setRefreshing(false);
        }
    };

    return { refreshing, onRefresh };
};