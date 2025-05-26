import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import TransactionButton from '../../components/TransactionButton';
import { useHomeViewModel } from '../../viewmodels/HomeViewModel';
import { TransactionModal } from '../../components/TransactionModal';
import { getTransactionsForCurrentMonth, saveTransaction } from '../../viewmodels/storageService';
import { PieChartBalance } from '../../components/PieChartBalance';


const home = () => {
  const vm = useHomeViewModel();
  const [hidden, setHidden] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

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

  return (
    <ScrollView className='flex-1'>
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
              if (!hidden) {
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
        <View className='bg-blue-400 mx-5 mt-10'>
          <PieChartBalance
            income={totalIncome}
            expense={totalExpense}
            title="Resumen de este mes"
          />
        </View>
        
      </View>
      <TransactionModal
        visible={modalVisible}
        type={transactionType}
        onClose={() => setModalVisible(false)}
        onSubmit={async (title, amount) => {
          console.log('entrando a submit');
          try {
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
    </ScrollView>
  );
};

export default home;

const styles = StyleSheet.create({});