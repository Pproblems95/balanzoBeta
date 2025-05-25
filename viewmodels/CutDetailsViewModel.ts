import { useState, useEffect } from 'react';
import { Cut, calculateCutBalance } from '../models/Cut';
import { getCutById } from './storageService';

export function useCutDetailsViewModel(cutId: string){
    const [cut, setCut] = useState <Cut | null>(null);
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        loadCut();
    }, [cutId]);

    async function loadCut() {
        const data = await getCutById(cutId);
        setCut(data);
        setBalance(data ? calculateCutBalance(data.transactions) : 0);
    }

    return {
        cut,
        balance
    }
}