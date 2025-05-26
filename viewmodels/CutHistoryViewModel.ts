// src/viewmodels/CutsHistoryViewModel.ts

import { useEffect, useState } from 'react';
import { Cut } from '../models/Cut';
// Importa la nueva función de suscripción
import { getAllCuts, subscribeToBalanceChanges } from './storageService';

export function useCutsHistoryViewModel(){
    const [cuts, setCuts] = useState<Cut[]>([]);

    useEffect(() => {

        loadCuts();


        const unsubscribe = subscribeToBalanceChanges(loadCuts);


        return () => {
            unsubscribe();
            console.log('CutsHistoryViewModel: Desuscrito de cambios de balance.');
        };
    }, []);

    async function loadCuts() {
        console.log('CutsHistoryViewModel: Cargando cortes...');
        const storedCuts = await getAllCuts();
        setCuts(storedCuts);
    }

    return {
        cuts,
        reload: loadCuts 
    }
}