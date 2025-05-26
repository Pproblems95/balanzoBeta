// src/viewmodels/PerformanceViewModel.ts

import { useState, useEffect } from 'react';
import { MonthPerformance } from '../models/MonthPerformance';
// Importa la nueva función de suscripción
import { getMonthlyPerformance, subscribeToBalanceChanges } from './storageService';

export function usePerformanceViewModel(){
    const [performanceData, setPerformanceData] = useState<MonthPerformance[]>([]);

    useEffect(() => {
        // Carga inicial de datos
        loadPerformanceData();

        // Suscribirse a los cambios de balance
        const unsubscribe = subscribeToBalanceChanges(loadPerformanceData);

        // Limpieza: desuscribirse
        return () => {
            unsubscribe();
            console.log('PerformanceViewModel: Desuscrito de cambios de balance.');
        };
    }, []);

    async function loadPerformanceData(){
        console.log('PerformanceViewModel: Cargando datos de performance mensual...');
        const data = await getMonthlyPerformance();
        setPerformanceData(data);
    }

    return{
        performanceData
    };
}