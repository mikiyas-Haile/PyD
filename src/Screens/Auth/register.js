import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MainLookup } from '../../lookup'
import { useNavigation } from '@react-navigation/native';
import authStyles from './styles'
import { url } from '../../components/urls'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../../components/colors'
import {
  View,
  TouchableOpacity,
  Text,
  useColorScheme,
  TextInput,
  Linking,
  ActivityIndicator,
  Dimensions,
  Platform,
  ToastAndroid,
  Image,
  ImageBackground
} from 'react-native';

const { width, height } = Dimensions.get('window')
const host = url()

export function Post(callback, props) {
  const { data, endpoint } = props
  fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
    .then(response => response.json()).then(response => {
      const cb = (res, code) => {
        callback(res, code)
      }
      MainLookup(cb, { endpoint, data, csrf: response.csrf, method: 'POST' })
    })
    .catch(error => console.log(error))
}

export function LandingPage() {
  const isDarkMode = useColorScheme() === 'dark';
  const nav = useNavigation();
  // const textColor = isDarkMode ? 'white' : 'black';
  const textColor = colors.primary
  // const bgColor = isDarkMode ? 'black' : 'white';
  const bgColor = 'black';
  const BtnStyles = { padding: 10, backgroundColor: textColor, width: width / 1.2, borderRadius: 10, margin: 5, alignItems: 'center' }
  const BtnTextStyles = [authStyles.MainActionText, { color: bgColor }]
  return (
    <ImageBackground tintColor={textColor} blurRadius={50} style={{ tintColor: textColor, backgroundColor: 'black', flex: 1,  alignItems: 'center', justifyContent: 'space-evenly' }} source={require('../../../assets/logos/pyd-logo/0.png')} >
      <Image style={{ tintColor: textColor, width: 200, height: 200 }} source={require('../../../assets/logos/pyd-logo/0.png')} />
      <View>
        <Text style={[authStyles.MainActionText, { color: 'white', alignSelf: 'center', fontFamily: 'Bold', fontSize: 40 }]}>
          Try Your luck.
        </Text>
        <Text style={[authStyles.MainActionText, { color: 'white', alignSelf: 'center', fontFamily: 'Bold', fontSize: 60 }]}>
          Have fun.
        </Text>
        <Text style={[authStyles.MainActionText, { color: 'white', alignSelf: 'center', fontFamily: 'Bold', fontSize: 50 }]}>
          ByD Easily.
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => (
          nav.push("login")
        )} style={BtnStyles}>
          <Text style={BtnTextStyles}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (
          nav.push("register")
        )} style={[BtnStyles, { borderWidth: 1, borderColor: textColor, backgroundColor: 'transparent' }]}>
          <Text style={[BtnTextStyles, { color: textColor }]}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

{/* <View style={[authStyles.container, { backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center', paddingTop: 0 }]}>
      <View style={{ position: 'absolute', top: 50, }}>
        <Image style={{ tintColor: textColor, width: 100, height: 100 }} source={require('../../../assets/logos/pyd-logo/0.png')} />
        <Text style={[authStyles.MainActionText, { color: textColor, alignSelf: 'center' }]}>
          PyD
        </Text>
      </View>
      <Text style={[authStyles.MainActionText, { color: textColor, alignSelf: 'center' }]}>
          Try Your luck. Have fun.
        </Text>
      <Image blurRadius={200} style={{ tintColor: textColor }} source={require('../../../assets/logos/pyd-logo/0.png')} />
      <View style={{ marginTop: 'auto' }}>
        <TouchableOpacity onPress={() => (
          nav.push("login")
        )} style={BtnStyles}>
          <Text style={BtnTextStyles}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (
          nav.push("register")
        )} style={[BtnStyles, { borderWidth: 1, borderColor: textColor, backgroundColor: 'transparent' }]}>
          <Text style={[BtnTextStyles, { color: textColor }]}>Register</Text>
        </TouchableOpacity>
      </View>
    </View> */}

export function Registration() {
  const isDarkMode = useColorScheme() === 'dark';
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [emailTaken, setEmailTaken] = useState(false)
  const [usernameTaken, setUsernameTaken] = useState(false)
  const [passwordDidntMatch, setPasswordDidntMatch] = useState(false)
  const [passwordTooShort, setpasswordTooShort] = useState(false)
  const [more, setMore] = useState(false)
  const color = useColorScheme();
  const nav = useNavigation();

  const register = () => {
    if (email && username && password1 && password2) {
      setEmailTaken(false)
      setUsernameTaken(false)
      setPasswordDidntMatch(false)
      setpasswordTooShort(false)
      setMore(true)
      const cb = (r, c) => {
        console.log(r, c)
        setMore(false)
        if (c === 201) {
          if (r.key) {
            AsyncStorage.setItem("Token", r.key)
            nav.reset({
              index: 0,
              routes: [{ name: 'VerifyYourEmail', params: { email } }],
            })
          }
        } else {
          if (c === 400) {
            if (r.email) {
              setEmailTaken(true)
            } else if (r.username) {
              setUsernameTaken(true)
            } else if (r.non_field_errors) {
              setPasswordDidntMatch(true)
            } else if (r.password1) {
              setpasswordTooShort(true)
            }
          } else if (c === 403) {
            if (Platform.OS === 'android') {
              ToastAndroid.show("There was a network error. Please try again.", 1000)
            } else {
              alert("There was a network error. Please try again.")
            }
          }
        }
      }
      Post(cb, { data: { email, username, password1, password2 }, endpoint: `/api/rest-auth/registration/` })
    }
  }
  // const textColor = isDarkMode ? 'white' : 'black';
  const textColor = 'white'
  // const bgColor = isDarkMode ? 'black' : 'white';
  const bgColor = 'black'
  const [ize, setize] = useState(10)

  return (
    <>
      <View style={[authStyles.container, { backgroundColor: bgColor }]}>
        <Text style={[authStyles.TitleStyle, { color: textColor }]}>
          Join PyD
        </Text>
        <TextInput
          autoCapitalize='none'
          placeholderTextColor='grey'
          style={[authStyles.input, { color: textColor, margin: ize }]}
          onPressIn={() => {
            setize(20)
          }}
          keyboardType={"email-address"}
          autoFocus={true}
          autoComplete={'email'}
          placeholder='Email'
          value={email}
          onChangeText={setEmail} />
        <TextInput
          autoCapitalize='none'
          placeholderTextColor='grey'
          style={[authStyles.input, { color: textColor, margin: ize }]}
          onPressIn={() => {
            setize(20)
          }}
          autoComplete={"username"}
          placeholder='Username'
          value={username}
          onChangeText={setUsername} />
        <TextInput
          autoCapitalize='none'
          placeholderTextColor='grey'
          style={[authStyles.input, { color: textColor, margin: ize }]}
          onPressIn={() => {
            setize(20)
          }}
          autoComplete={'password-new'}
          placeholder='Password ( Alteast 8 Characters )'
          secureTextEntry={true}
          value={password1}
          onChangeText={setPassword1} />
        <TextInput
          autoCapitalize='none'
          placeholderTextColor='grey'
          style={[authStyles.input, { color: textColor, margin: ize }]}
          onPressIn={() => {
            setize(20)
          }}
          placeholder='Confirm Password'
          secureTextEntry={true}
          value={password2}
          onChangeText={setPassword2}
        />
        <TouchableOpacity onPress={register} style={[authStyles.MainActionButton, { backgroundColor: textColor }]}>
          <Text style={[authStyles.MainActionText, { color: bgColor }]}>{more ? <ActivityIndicator size="small" color={bgColor} /> : 'Register'}</Text>
        </TouchableOpacity>
      </View>
      <View style={authStyles.warningContainers}>
        {emailTaken ? <View style={[authStyles.WarningBoxContainer, { backgroundColor: '#9ea808' }]}>
          <Text style={[authStyles.WarningBoxText, { color: textColor }]}>
            Email is already in use.
          </Text>
        </View> : null}
        {usernameTaken ? <View style={[authStyles.WarningBoxContainer, { backgroundColor: '#9ea808' }]}>
          <Text style={[authStyles.WarningBoxText, { color: textColor }]}>
            Username is already in use.
          </Text>
        </View> : null}
        {passwordDidntMatch ? <View style={[authStyles.WarningBoxContainer, { backgroundColor: '#9ea808' }]}>
          <Text style={[authStyles.WarningBoxText, { color: textColor }]}>
            Passwords didn't match
          </Text>
        </View> : null}
        {passwordTooShort ? <View style={[authStyles.WarningBoxContainer, { backgroundColor: '#9ea808' }]}>
          <Text style={[authStyles.WarningBoxText, { color: textColor }]}>
            Password too short
          </Text>
        </View> : null}
      </View>
      <TouchableOpacity onPress={() => {
        nav.pop()
      }} style={authStyles.BackButton}>
        <Ionicons name='chevron-back-outline' size={30} color={textColor} />
      </TouchableOpacity>
    </>
  );
}
export function VerificationNeeded(props) {
  const isDarkMode = useColorScheme() === 'dark';
  const { email } = props?.route?.params;
  const nav = useNavigation();
  const textColor = isDarkMode ? 'white' : 'black';
  const bgColor = isDarkMode ? 'black' : 'white';

  useEffect(() => {
    AsyncStorage.setItem("EmailVerified", "false")
  }, [])

  return (
    <View style={[authStyles.container, { backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center', paddingTop: 0 }]}>
      <Text style={[authStyles.MainActionText, { color: textColor, marginTop: 'auto' }]}>Verification link has been sent to {email}.</Text>
      <Text style={[authStyles.MainActionText, { color: textColor }]}>Please verify your email.</Text>
      <View style={{ marginVertical: 15 }}>
        <TouchableOpacity onPress={() => {
          Linking.openURL("https://gmail.google.com")
        }} style={[authStyles.WarningBoxContainer, { backgroundColor: '#9ea808', padding: 10 }]}>
          <Text style={[authStyles.WarningBoxText, { color: textColor }]}>Open Gmail{" -> "}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          nav.reset({
            index: 0,
            routes: [{ name: 'Home Page' }],
          })
        }} style={[authStyles.WarningBoxContainer, { padding: 10 }]}>
          <Text style={[authStyles.WarningBoxText, { color: textColor }]}>Verify later</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}