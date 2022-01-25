import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
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
    ToastAndroid
} from 'react-native';
import { MainLookup } from '../../lookup'
import { useNavigation } from '@react-navigation/native';
import authStyles from './styles'
import { url } from '../../components/urls'
import Ionicons from 'react-native-vector-icons/Ionicons'


const { width, height } = Dimensions.get('window')
const host = url()

function Post(callback, props) {
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

export function Login() {
    const isDarkMode = useColorScheme() === 'dark';
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password1, setPassword1] = useState('')
    const [emailTaken, setEmailTaken] = useState(false)
    const [usernameTaken, setUsernameTaken] = useState(false)
    const [passwordDidntMatch, setPasswordDidntMatch] = useState(false)
    const [passwordTooShort, setpasswordTooShort] = useState(false)
    const [more, setMore] = useState(false)
    const color = useColorScheme();
    const nav = useNavigation();

    const login = () => {
        if (username && password1) {
            setPasswordDidntMatch(false)
            setMore(true)
            const cb = (r, c) => {
                console.log(r, c)
                setMore(false)
                if (c === 200) {
                    if (r.key) {
                        AsyncStorage.setItem("Token", r.key)
                        nav.reset({
                            index: 0,
                            routes: [{ name: 'Home Page' }],
                        })
                    }
                } else {
                    if (c === 400) {
                        if (r.non_field_errors) {
                            if (Platform.OS === 'android') {
                                ToastAndroid.show("Make sure to check your capitaliztion. both fields are case sensitive.", 1000)
                            } else {
                                alert("Make sure to check your capitaliztion. both fields are case sensitive.")
                            }
                            setPasswordDidntMatch(true)
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
            Post(cb, { data: { username, password: password1 }, endpoint: `/api/rest-auth/login/` })
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
                    Login to PyD
                </Text>
                <TextInput
                    autoFocus={true}
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
                    autoComplete={'password'}
                    placeholder='Password'
                    secureTextEntry={true}
                    value={password1}
                    onChangeText={setPassword1} />
                <TouchableOpacity onPress={login} style={[authStyles.MainActionButton, { backgroundColor: textColor }]}>
                    <Text style={[authStyles.MainActionText, { color: bgColor }]}>{more ? <ActivityIndicator size="large" color={bgColor} /> : 'Login'}</Text>
                </TouchableOpacity>
            </View>
            <View style={authStyles.warningContainers}>
                {passwordDidntMatch ? <View style={[authStyles.WarningBoxContainer, { backgroundColor: '#9ea808' }]}>
                    <Text style={[authStyles.WarningBoxText, { color: textColor }]}>
                        Username and password didn't match
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