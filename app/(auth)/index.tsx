import { Image, ImageBackground, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const index = () => {
  return (
    <View className="flex-1">
      <View className="flex-[0.8]">
        <ImageBackground
        source={require('../../assets/Images/indexImage1cropped.jpg')}
        resizeMode="cover"
        className="flex-1 justify-center items-center"
        imageStyle={{alignSelf:'center'}}
      >
        <Text className="text-white text-7xl font-bold">Balanzo</Text>
      </ImageBackground>
      </View>

      <View className="flex-[0.2] bg-green-700 justify-center ">
        <TouchableOpacity className="bg-white px-5 py-4 rounded-xl mx-10" onPress={() => router.navigate('home')}>
          <Text className="text-center font-bold text-2xl text-black">
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})