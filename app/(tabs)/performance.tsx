import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getMonthlyPerformance } from '../../viewmodels/storageService'; 
import { MonthPerformance } from '../../models/MonthPerformance';
import { CartesianChart, Bar } from "victory-native"; // useBarPath no es necesario si solo usas <Bar>
import { useFont } from '@shopify/react-native-skia'; 

const monthsNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Define un tipo específico para los datos que se le pasarán a CartesianChart
interface ChartDataItem {
  monthYearLabel: string; // La etiqueta para el eje X
  balanceValue: number; // El valor para el eje Y
  // Añadir un índice de firma si el error persiste, aunque con las claves explícitas no debería ser necesario.
  [key: string]: unknown; // Permite que TypeScript sepa que puede haber otras propiedades de string
}


const PerformanceScreen = () => {
  const [performanceData, setPerformanceData] = useState<MonthPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  // Asegúrate de que la ruta de la fuente sea correcta para tu proyecto
  const font = useFont(require('../../assets/fonts/Roboto-VariableFont_wdth,wght.ttf'), 12); 

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await getMonthlyPerformance();
        
        const sortedData = [...data].sort((a, b) => {
          if (a.year !== b.year) {
            return b.year - a.year;
          }
          return b.month - a.month;
        });

        // Obtener los 3 meses más recientes y revertir el orden
        const last3Months = sortedData.slice(0, 3).reverse(); 
        
        console.log("Datos de performance (todos):", data);
        console.log("Últimos 3 meses para la gráfica (ordenados):", last3Months);
        setPerformanceData(last3Months); 
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  // Prepara los datos para CartesianChart usando el tipo ChartDataItem
  console.log('Performance data antes de generar labels:', performanceData);

  const chartData: ChartDataItem[] = performanceData.map((item) => {
  const isValidMonth = Number.isInteger(item.month) && item.month >= 1 && item.month <= 12;
  const monthName = isValidMonth ? monthsNames[item.month - 1] : `Mes ${item.month}`;

  const isValidBalance = typeof item.balance === 'number' && !isNaN(item.balance);
  return {
    monthYearLabel: `${monthName.substring(0, 3)} '${item.year.toString()}`,
    balanceValue: isValidBalance ? item.balance : 0,
  };
});
console.log("Datos que van a la gráfica:", chartData); 
  // Ya no es necesario el casteo 'as Array<Record<string, unknown>>' si ChartDataItem tiene el índice de firma

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-700">Cargando datos de performance...</Text>
      </View>
    );
  }

  if (performanceData.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-700">No hay datos de performance disponibles para la gráfica.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-50">
      <Text className="text-2xl font-bold text-center mt-5 mb-6 text-gray-800">Performance Mensual (Últimos 3 Meses)</Text>
      
      <View className="flex-1 h-64 bg-white rounded-lg shadow-md p-4">
        {font ? ( // Asegúrate de que la fuente se ha cargado antes de renderizar CartesianChart
          <CartesianChart 
            data={chartData} 
            xKey="monthYearLabel" // Usamos 'monthYearLabel' para el eje X
            yKeys={["balanceValue"]} // 'balanceValue' es la clave para el eje Y
            domain={{ 
              y: [0, Math.max(...performanceData.map(d => d.balance)) * 1.2]
            }}
            axisOptions={{
              font: font, 
              labelColor: '#6B7280', 
              lineColor: '#E5E7EB', 
              labelOffset: { x: 0, y: 0 }, 
              tickCount: 5, 
            }}
            padding={{ top: 20, bottom: 40, left: 10, right: 10  }}
          >
            {({ points, chartBounds }) => (
              <Bar
                points={points["balanceValue"]} // Usamos los puntos de 'balanceValue'
                chartBounds={chartBounds}
                color="green" 
                innerPadding={0.4} 
                roundedCorners={{ topLeft: 4, topRight: 4 }} 
                labels={{ 
                  position: "top", 
                  font: font, 
                  color: '#1F2937', 
                }}
              />
            )}
          </CartesianChart>
        ) : (
          <Text className="text-center text-gray-500">Cargando fuente para la gráfica...</Text>
        )}
      </View>

      <View className="mt-8">
        <Text className="text-lg font-semibold mb-3 text-gray-700">Detalles de los Últimos 3 Meses:</Text>
        {performanceData.map((item, index) => (
          <Text key={index} className="text-base text-gray-800 mb-1">
            <Text className="font-medium">{monthsNames[item.month - 1]} {item.year}:</Text> ${item.balance.toFixed(2)}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default PerformanceScreen;