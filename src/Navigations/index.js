import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleSheet, Text, useColorScheme, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { Registration, VerificationNeeded, LandingPage } from '../Screens/Auth/register'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import colors from '../components/colors'
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import ProfileScreen from '../Screens/ProfileScreen/index'
import ChatListScreen from '../Screens/MessengerScreens/ChatsScreen/index'

import { Login } from '../Screens/Auth/login'
import AdsScreen from '../Screens/HomePage/AdsScreen'
import LotteriesScreen from '../Screens/HomePage/LotteriesScreen'
import PurchaseCoupon from '../Screens/PurchaseCoupon/index'
import { ScanCoupon } from '../Screens/PurchaseCoupon/index'
import MessengerRoom from '../Screens/MessengerScreens/MessagesScreen/index'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();
const Tab = createMaterialTopTabNavigator();
const HomeName = "Home"
const LotteryName = "Lottery"
const ProfileName = "Profile"

function HomeNavigation(){
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? 'white' : 'black';
  const bgColor = isDarkMode ? 'black' : 'white';
  const nav = useNavigation();

  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 5 }} onPress={()=>(nav.push("Top-up Account"))}>
          <Ionicons name='add' color={colors.primary} size={35} />
        </TouchableOpacity>
      )
    })
  },[])
  return (
    <AdsScreen/>
        // <Tab.Navigator
        //     screenOptions={{
        //         tabBarIndicatorStyle: { backgroundColor: "#2c3e50", },
        //         tabBarLabelStyle: { textTransform: 'none', fontFamily: "Bold", color: textColor, },
        //         tabBarPressColor: colors.primary,
        //         tabBarStyle: { backgroundColor: bgColor },
        //         swipeEnabled: true,
        //         scrollEnabled: true,
        //     }} initialRouteName='Profile Home' style={{ backgroundColor: bgColor }}>
        //     <Tab.Screen name='Profile Home' options={{ title: 'Advertisments' }} component={AdsScreen} />
        //     <Tab.Screen name='Profile Posts' options={{ title: 'Lotteries' }} component={LotteriesScreen} />
        // </Tab.Navigator>
  )
}
const ChatName = 'Messenger'
export function MainPageNavigation(){
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? 'white' : 'black';
  const bgColor = isDarkMode ? 'black' : 'white';

  return (
    <BottomTab.Navigator screenOptions={({ route }) => ({ 
        tabBarIndicatorStyle: { backgroundColor: "#2c3e50", },
        tabBarLabelStyle: { textTransform: 'none', fontFamily: "Bold", color: textColor, },
        tabBarPressColor: colors.primary,
        tabBarStyle: { backgroundColor: bgColor },
        swipeEnabled: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#2c3e50',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name
          if (rn === HomeName) {
            iconName = 'home'
            return <AntDesign name={iconName} size={30} color={color} />
          }
          else if (rn === LotteryName) {
            iconName = 'search-outline'
            return <Ionicons name={iconName} size={30} color={color} />
          }
          else if (rn === ProfileName) {
            iconName = 'user'
            return (
                <AntDesign name={iconName} size={30} color={color} />
            )
          }
          else if (rn === ChatName) {
            iconName = 'envelope'
            return (
                <EvilIcons name={iconName} size={30} color={color} />
            )
          }
        },
     })} initialRouteName={HomeName}>
      <BottomTab.Group screenOptions={{ headerStyle: { backgroundColor: bgColor, borderBottomColor: '#2c3e50', borderBottomWidth: 1 }, headerTitleAlign: 'center', headerTitleStyle: { color: textColor, fontFamily: 'Bold' } }}>
        <BottomTab.Screen name={HomeName} component={HomeNavigation} />
        <BottomTab.Screen name={ChatName} component={ChatListScreen} />
        <BottomTab.Screen name={ProfileName} component={ProfileScreen} />
      </BottomTab.Group>
    </BottomTab.Navigator>
  )
}


export function MainNavigation() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [token, setToken] = useState(false)
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? 'white' : 'black';
  const bgColor = isDarkMode ? 'black' : 'white';
  useEffect(() => {
    const eb = (e, r) => {
      if (r) {
        setLoggedIn(true)
        setToken(r)
      } else {
        setLoggedIn(false)
      }
    }
    AsyncStorage.getItem('Token', eb)
  }, [])
  const initName = loggedIn ? "Home Page" : "LandingPage"
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initName}>
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Home Page' component={MainPageNavigation} />
          {loggedIn ? null : <Stack.Screen name='LandingPage' component={LandingPage} />}
          <Stack.Screen name='login' component={Login} />
          <Stack.Screen name='register' component={Registration} /> 
          <Stack.Screen initialParams={{ "email": '' }} name='VerifyYourEmail' component={VerificationNeeded} /> 
        </Stack.Group>

        <Stack.Screen name='Send User Message' options={{ headerStyle: { backgroundColor: bgColor, borderBottomColor: '#2c3e50', borderBottomWidth: 1 }, headerTitleAlign: 'center', headerTitleStyle: { color: textColor, fontFamily: 'Bold' } }} component={MessengerRoom} />
        <Stack.Screen name='Profile' options={{ headerStyle: { backgroundColor: bgColor, borderBottomColor: '#2c3e50', borderBottomWidth: 1 }, headerTitleAlign: 'center', headerTitleStyle: { color: textColor, fontFamily: 'Bold' } }} component={ProfileScreen} />
        <Stack.Screen name='Top-up Account' options={{ headerStyle: { backgroundColor: bgColor, borderBottomColor: '#2c3e50', borderBottomWidth: 1 }, headerTitleAlign: 'center', headerTitleStyle: { color: textColor, fontFamily: 'Bold' } }} component={PurchaseCoupon} />
        <Stack.Screen name='Scan Coupon' options={{ headerStyle: { backgroundColor: bgColor, borderBottomColor: '#2c3e50', borderBottomWidth: 1 }, headerTitleAlign: 'center', headerTitleStyle: { color: textColor, fontFamily: 'Bold' } }} component={ScanCoupon} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
