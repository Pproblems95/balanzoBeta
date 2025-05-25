import { useEffect, useState } from 'react';
import { Cut } from '../models/Cut';
import { getAllCuts } from './storageService';

export function useCutsHistoryViewModel(){
    const [cuts, setCuts] = useState<Cut[]>([]);

    useEffect(() => {
        loadCuts();
    }, []);

    async function loadCuts() {
        const storedCuts = await getAllCuts();
        setCuts(storedCuts);
    }

    return {
        cuts,
        reload: loadCuts
    }
}