import { StyleSheet, Text, View, Modal, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react';
import TransactionButton from '../../components/TransactionButton'
import { useHomeViewModel } from '../../viewmodels/HomeViewModel';

const home = () => {

  const {balance, transactions, reload} = useHomeViewModel()
  const [hidden, setHidden] = useState(false)



  return (
    <View className='flex-1'>
      <View className='bg-white mx-5 mt-10'>
        <View className='p-5'>
          <Text className='text-3xl'>Hola, usuario!</Text>
          <Text className='text-3xl my-5'>Este es tu balance este mes:</Text>
          <View className='flex-row justify-between'>
            <View className='flex-1'>
              <Text className='text-4xl text-green-700 text-clip min-w-0' numberOfLines={1}>${hidden ? '$$' : (balance.toFixed(2))}</Text>
            </View>
            <TransactionButton  text={hidden ? 'Revelar' : 'Ocultar'} onPress={() => {
              if(!hidden){
                setHidden(true);
                return;
              }
              setHidden(false);
            }} />
          </View>
          <View className='flex-row justify-between mt-10 '>
            <TransactionButton  text='Ingreso' onPress={() => {}} />
            <TransactionButton  text='Gasto' onPress={() => {}} />
          </View>
        </View>
      </View>
      
    </View>
  )
}

export default home

const styles = StyleSheet.create({})