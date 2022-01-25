import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MainNavigation } from './src/Navigations/index'
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';
import firebase from "firebase";
import { MainLookup } from './src/lookup/index'
import colors from './src/components/colors'

function AuthStateNavigationContainer() {
  const [tok, setTok] = useState()

  useEffect(() => {
    const cb = (e, r) => {
      if (r) {
        setTok(r)
      }
    }
    AsyncStorage.getItem("Token", cb)
  },[])

  useEffect(() => {
    if (tok) {
      const timer = setInterval(() => {
        const cb = (response, code) => {
          if ([response.new_notifications.length] > 0) {
            const callback = (response, code_) => {
              if (response) {
                console.log(response, 130)
                schedulePushNotification(response)
              }
            }
            LookupNewNotification(callback, tok)
          }
        }
        MainLookup(cb, { endpoint: '/api/notifications', method: 'GET', token: tok })
      }, 3000);
      return () => clearInterval(timer);
    }
  });
  return (
    <MainNavigation />
  )
}

export default function App() {
  let [fontsLoaded] = useFonts({
    'Poppins-Light': require("./assets/fonts/Poppins/Poppins-Light.ttf"),
    'Poppins-Regular': require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    'Poppins-Bold': require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
    'Poppins-ExtraLight': require("./assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
    'Poppins-BoldItalic': require("./assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
    'Poppins-ExtraLightItalic': require("./assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf"),
    'Italic': require("./assets/fonts/Nunito-Italic-VariableFont_wght.ttf"),
    'VariableFont_wght': require("./assets/fonts/Nunito-VariableFont_wght.ttf"),
    'Noto-Bold': require("./assets/fonts/Noto_Sans/NotoSans-Bold.ttf"),
    'Noto-BoldItalic': require("./assets/fonts/Noto_Sans/NotoSans-BoldItalic.ttf"),
    'Noto-Italic': require("./assets/fonts/Noto_Sans/NotoSans-Italic.ttf"),
    'Noto-Regular': require("./assets/fonts/Noto_Sans/NotoSans-Regular.ttf"),
    'Black': require("./assets/fonts/Montserrat-Black.ttf"),
    'BlackItalic': require("./assets/fonts/Montserrat-BlackItalic.ttf"),
    'Bold': require("./assets/fonts/Montserrat-Bold.ttf"),
    'BoldItalic': require("./assets/fonts/Montserrat-BoldItalic.ttf"),
    'Italic2': require("./assets/fonts/Montserrat-Italic.ttf"),
    'Light': require("./assets/fonts/Montserrat-Light.ttf"),
    'LightItalic': require("./assets/fonts/Montserrat-LightItalic.ttf"),
    'Medium': require("./assets/fonts/Montserrat-Medium.ttf"),
    'MediumItalic': require("./assets/fonts/Montserrat-MediumItalic.ttf"),
    'Regular': require("./assets/fonts/Montserrat-Regular.ttf"),
    'Thin': require("./assets/fonts/Montserrat-Thin.ttf"),
    'ThinItalic': require("./assets/fonts/Montserrat-ThinItalic.ttf"),
    'Italic3': require("./assets/fonts/SourceSans3-Italic-VariableFont_wght.ttf"),
    'VariableFont_wght2': require("./assets/fonts/SourceSans3-VariableFont_wght.ttf"),
  })
  if (!fontsLoaded) {
    return <AppLoading />
  } else {
    return (
      <AuthStateNavigationContainer />
    )
  }
}


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
function LookupNewNotification(callback, token) {
  const cb = (response, code) => {
    // console.log([...response.new_notifications], 53)
    if ([response].length > 0) {
      callback(response[0], code)
    } else {
      callback({}, 400)
    }
  }
  MainLookup(cb, { endpoint: '/api/new-notifications', method: 'GET', token: token })
}


const firebaseConfig = {
  apiKey: "AIzaSyAerzaWKI8hibbhcbM-cGAsDlscudXELCs",
  authDomain: "pyd-storage.firebaseapp.com",
  projectId: "pyd-storage",
  storageBucket: "pyd-storage.appspot.com",
  messagingSenderId: "1098978740625",
  appId: "1:1098978740625:web:feda32b40bfa45c4a63230"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}



async function schedulePushNotification(props) {
  const word = props
  var data = {}
  if (word.type === 'new_msg') {
    data['name'] = `You have a new message from ${word.from_user.username}`
  } else {
    data['name'] = `You have a new Notification!`
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `PyD`,
      subtitle: `${data.name}`,
      body: `${word.name}`,
      color: colors.primary,
    },
    trigger: { seconds: 1, channelId: word.type, },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      ToastAndroid.show('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
  } else {
    ToastAndroid.show('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}