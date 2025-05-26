import { Text, TouchableOpacity, View, FlatList } from 'react-native'; // Eliminamos StyleSheet
import React, { useEffect, useState } from 'react';
import { getMonthlyPerformance, insertMockCuts, getAllCuts } from '../../viewmodels/storageService'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- INTERFACES NECESARIAS ---
interface MonthPerformance {
  month: number;
  year: number;
  balance: number;
}

interface GroupedYearData {
  year: number;
  months: { month: number; balance: number }[];
}
// --- FIN INTERFACES ---

const monthsNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const groupByYear = (performance: MonthPerformance[]): GroupedYearData[] => {
  const grouped: { [year: string]: { month: number; balance: number }[] } = {};

  performance.forEach(({ year, month, balance }) => {
    const yearStr = year.toString();
    if (!grouped[yearStr]) {
      grouped[yearStr] = [];
    }
    grouped[yearStr].push({ month, balance });
  });

  return Object.entries(grouped)
    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    .map(([yearStr, months]) => ({
      year: parseInt(yearStr),
      months: months.sort((a, b) => b.month - a.month),
    }));
};

const HistoryScreen = () => {
  const [groupedData, setGroupedData] = useState<GroupedYearData[]>([]);

  async function loadHistoryData() {
    console.log('--- Iniciando carga de historial ---');
    const performance = await getMonthlyPerformance();
    console.log('getMonthlyPerformance devolvió:', performance);
    const grouped = groupByYear(performance);
    console.log('Datos agrupados para el FlatList:', grouped);
    setGroupedData(grouped);
    console.log('--- Carga de historial finalizada ---');
  }

  useEffect(() => {
    async function initializeAndLoad() {
      console.log('HistoryScreen: Ejecutando initializeAndLoad en useEffect');
      await insertMockCuts(); 
      await loadHistoryData(); 
    }
    initializeAndLoad();
  }, []);

  const renderYearItem = ({ item }: { item: GroupedYearData }) => (
    <View key={item.year} className="mb-8">
      <Text className="text-xl font-bold text-gray-800 mb-3 text-center">{item.year}</Text>
      {item.months.map(({ month, balance }) => (
        <TouchableOpacity
          key={`${item.year}-${month}`}
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-2 shadow-sm"
          onPress={() => {
            console.log(`Presionado: ${monthsNames[month - 1]} ${item.year} con saldo $${balance.toFixed(2)}`);
            // Aquí irá tu navegación a la pantalla de detalles del corte
          }}
        >
          <Text className="text-xl text-black text-center">
            {monthsNames[month - 1]} 
          </Text>
          <Text className= "text-xl text-green-700 text-center">Balance del mes: ${typeof balance === 'number' ? balance.toFixed(2) : 'N/A'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  try{
    return (
    <View className="flex-1 m-2"> {/* Equivalente a style={{flex: 1}} */}
      <FlatList
        data={groupedData}
        renderItem={renderYearItem}
        keyExtractor={(item) => item.year.toString()}
        // contentContainerStyle para FlatList se convierte a className
        // Asegura que el FlatList ocupe todo el espacio disponible si no hay elementos
        className="px-4 py-6 bg-white min-h-full" 
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-12"> {/* mt-12 para marginTop: 50 */}
            <Text className="text-base text-gray-600">No hay historial de balance disponible.</Text> {/* text-gray-600 para color: #888 */}
          </View>
        }
      />

      {/* --- Botones de Depuración --- */}
      <View className="p-4 border-t border-t-gray-200 bg-purple-700flex-1"> {/* p-4 para padding: 10, border-t para borderTopWidth, bg-gray-100 para #f5f5f5 */}
        <TouchableOpacity
          className="bg-purple-700 p-3 rounded-lg mb-2" // bg-purple-700 para #6200EE, p-3 para padding: 12, rounded-lg para borderRadius: 8, mb-2 para marginBottom: 8
          onPress={async () => {
            console.log('Intentando insertar cortes de prueba manualmente...');
            await insertMockCuts();
            await loadHistoryData(); 
            console.log('Cortes de prueba insertados y datos recargados.');
          }}
        >
          <Text className="text-white text-center font-bold">Insertar Cortes PRUEBA y Recargar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-purple-700 p-3 rounded-lg mb-2"
          onPress={async () => {
            const cuts = await getAllCuts();
            console.log('Contenido ACTUAL de AsyncStorage para "cuts":', JSON.stringify(cuts, null, 2));
          }}
        >
          <Text className="text-white text-center font-bold">Ver "cuts" en AsyncStorage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 p-3 rounded-lg mb-2" // Usamos red-500 para el botón de borrar
          onPress={async () => {
            await AsyncStorage.removeItem('cuts');
            await loadHistoryData();
            console.log('Clave "cuts" borrada de AsyncStorage y datos recargados.');
          }}
        >
          <Text className="text-white text-center font-bold">Borrar "cuts" en AsyncStorage</Text>
        </TouchableOpacity>
      </View>
      {/* --- Fin Botones de Depuración --- */}
    </View>
  );
  }catch{
    
  }
  
};

export default HistoryScreen;

// Eliminamos el bloque StyleSheet.create ya que todos los estilos están en className