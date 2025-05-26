import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import TransactionButton from '../../components/TransactionButton'
import { useHomeViewModel } from '../../viewmodels/HomeViewModel';
import { TransactionModal } from '../../components/TransactionModal';
import { getTransactionsForCurrentMonth, saveTransaction } from '../../viewmodels/storageService';

// NO importamos PieChartBalance ya que lo insertaremos directamente
// import { PieChartBalance } from '../../components/PieChartBalance';

// Importa VictoryPie y Svg directamente aquí
import { VictoryPie } from 'victory'; // Recuerda que VictoryPie viene de 'victory'
import Svg from 'react-native-svg'; // Y Svg de 'react-native-svg'


const home = () => {

  const vm = useHomeViewModel();
  const [hidden, setHidden] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [totalIncome, setTotalIncome] = useState(0); // Estos los usaremos en la gráfica de pastel si quieres
  const [totalExpense, setTotalExpense] = useState(0); // Estos los usaremos en la gráfica de pastel si quieres

  useEffect(() => {
    loadMonthlyTotals();
  }, []);

  const showIncomeModal = () => {
    setTransactionType('income');
    setModalVisible(true);
  };

  const showExpenseModal = () => {
    setTransactionType('expense');
    setModalVisible(true);
  };

  const loadMonthlyTotals = async () => {
    const transactions = await getTransactionsForCurrentMonth();

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setTotalIncome(income);
    setTotalExpense(expense);
  };

  // Datos para la gráfica de pastel simple, usando los mismos datos que ya tienes
  const pieData = [
    { x: 'Ingresos', y: totalIncome || 1 }, // Asegurarse de que no sea 0 para que se dibuje
    { x: 'Gastos', y: totalExpense || 1 }   // si ambos son 0, dará un valor mínimo de 1 para que se vea
  ];
  const pieColors = ['#16a34a', '#dc2626'];


  return (
    <View className='flex-1'>
      <View className='bg-white mx-5 mt-10'>
        <View className='p-5'>
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-lg"
            onPress={async () => {
              const raw = await AsyncStorage.getItem('transactions');
              console.log('Contenido de AsyncStorage:', raw);
            }}
          >
            <Text className="text-white text-center font-semibold">Ver transacciones</Text>
          </TouchableOpacity>
          <Text className='text-3xl'>Hola, usuario!</Text>
          <Text className='text-3xl my-5'>Este es tu balance este mes:</Text>
          <View className='flex-row justify-between'>
            <View className='flex-1'>
              <Text className='text-4xl text-green-700 text-clip min-w-0' numberOfLines={1}>
                ${hidden ? '$$' : (vm.balance.toFixed(2))}
              </Text>
            </View>
            <TransactionButton text={hidden ? 'Revelar' : 'Ocultar'} onPress={() => {
              if(!hidden){
                setHidden(true);
                return;
              }
              setHidden(false);
            }} />
          </View>
          <View className='flex-row justify-between mt-10 '>
            <TransactionButton text='Ingreso' onPress={showIncomeModal} />
            <TransactionButton text='Gasto' onPress={showExpenseModal} />
          </View>
        </View>
        <View className='bg-white mx-5 mt-10'>
            {/* Aquí insertamos la gráfica de pastel directamente */}
            <Text className="text-lg font-bold mb-2 text-center">Resumen de este mes</Text>
            <Svg width={300} height={300}>
              <VictoryPie
                data={pieData}
                colorScale={pieColors}
                innerRadius={50}
                // labelRadius={75} // Quitado para máxima simplicidad, si quieres, lo añades
                // labels={({ datum }) => `${datum.x}\n$${datum.y}`} // Quitado, si quieres, lo añades
                // style={{
                //   labels: { fill: 'black', fontSize: 14, fontWeight: 'bold' },
                // }} // Quitado, si quieres, lo añades
              />
            </Svg>
        </View>
      </View>
      <TransactionModal
        visible={modalVisible}
        type={transactionType}
        onClose={() => setModalVisible(false)}
        onSubmit={async (title, amount) => {

          console.log('entrando a submit');
          try{
          const now = new Date().toISOString();
          const id = Date.now().toString() + Math.random().toString(36).substring(2);
          console.log('entrando a savetransaction');


            console.log('Antes de saveTransaction');
            await saveTransaction(transactionType, id, title, amount, now);
            console.log('Después de saveTransaction');
          } catch (error) {
            console.log('Error en saveTransaction:', error);
          }

          await vm.reload();
          await loadMonthlyTotals();
          setModalVisible(false);
        }}
      />
    </View>
  )
}

export default home

const styles = StyleSheet.create({})