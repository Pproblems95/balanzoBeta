import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { NativeWindStyleSheet } from "nativewind";
NativeWindStyleSheet.setOutput({
  default: "native",
});

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name='(auth)' options={{headerShown:false}}/>
        <Stack.Screen name='(tabs)' options={{headerShown:false}}/>
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})