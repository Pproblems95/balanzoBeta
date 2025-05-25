import { useState, useEffect } from 'react';
import { MonthPerformance } from '../models/MonthPerformance';
import { getMonthlyPerformance } from './storageService';

export function usePerformanceViewModel(){
    const [performanceData, setPerformanceData] = useState<MonthPerformance[]>([]);

    useEffect(() => {
        loadPerformanceData();
    }, []);

    async function loadPerformanceData(){
        const data = await getMonthlyPerformance();
        setPerformanceData(data);
    }

    return{
        performanceData
    };
}