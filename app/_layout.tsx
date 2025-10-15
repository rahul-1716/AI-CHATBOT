import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Chat from '@/components/Chat'
import { StatusBar } from 'react-native'
const MainLayout = () => {
  return (
    <>
   <Chat />
   <StatusBar barStyle="default" />
   </>
  )
}

export default MainLayout

const styles = StyleSheet.create({})