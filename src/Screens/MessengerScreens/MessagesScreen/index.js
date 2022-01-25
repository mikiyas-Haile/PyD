import { StyleSheet, Text, View, useColorScheme, FlatList, TextInput, TouchableOpacity, Platform, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MainLookup } from '../../../lookup';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Message from './SingleMessage'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../../../components/colors'
import { useNavigation } from '@react-navigation/native'
import { PostHandler } from '../../../components/post'

export default function MessengerRoom(props) {
    const { UserProfile } = props?.route?.params
    const [token, setToken] = useState()
    const [body, setBody] = useState()
    const [state, setState] = useState([])
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const nav = useNavigation();
    useEffect(() => {
        const timer = setInterval(() => {
            const cd = (response, code) => {
                setState(response)
            }
            MainLookup(cd, { endpoint: `/api/my-chat/with/${UserProfile.username}`, token: token, method: 'GET' })
        }, 1000)
        return () => clearInterval(timer)
    });
    useEffect(() => {
        nav.setOptions({
            title: UserProfile.username,
            headerLeft: ()=>(
                <TouchableOpacity onPress={()=>(nav.pop())}>
                    <Ionicons name='chevron-back-outline' color={textColor} size={40} />
                </TouchableOpacity>
            )
        })
        const cb = (e, r) => {
            if (r) {
                setToken(r)
            }
        }
        AsyncStorage.getItem("Token", cb)
    }, [])

    const LoadMessages = () => {
        setLoading(true)
        const cd = (response, code) => {
            setLoading(false)
            setState(response)
        }
        MainLookup(cd, { endpoint: `/api/my-chat/with/${UserProfile.username}`, token: token, method: 'GET' })
    }

    const RenderMessage = ({ item, index }) => {
        return (
            <>
                <Message navigation={props.navigation} token={token} chat={item} key={`${item.id}`} />
            </>
        )
    }
    const SendMessage = () => {
        if (body) {
            setBody('')
            setSending(true)
            const callback = (r, c) => {
                setSending(false)
                console.log(r, c)
                if (!c === 201) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Was unable to send message. Please try again.', 30)
                    } else {
                        alert('Was unable to send message. Please try again.')
                    }
                }
            }
            PostHandler(callback, { endpoint: `/api/create-chat/with/${UserProfile.username}`, data: { body } })
        }
    }
    return (
        <>
            <FlatList
                backgroundColor={bgColor}
                data={state}
                renderItem={RenderMessage}
                refreshing={loading}
                onRefresh={LoadMessages}
                keyExtractor={(i, k) => k.toString()}
                inverted
            />
            {sending ?
                <Text style={{ paddingLeft: 30, fontFamily: 'Bold', color: textColor, backgroundColor: bgColor }}>
                    Sending Message..
                </Text> : null}
            <View style={{ backgroundColor: bgColor, padding: 10, flexDirection: 'row', justifyContent: 'space-around', marginTop: 'auto' }}>
                <TextInput
                    multiline
                    onChangeText={(val) => setBody(val)}
                    maxLength={240}
                    value={body}
                    data-name='body'
                    placeholderTextColor={'grey'}
                    placeholder='what are you thinking about?'
                    style={[styles.input, { color: textColor } ]}
                    autoFocus
                />
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={SendMessage}>
                    <FontAwesome name='send' color={colors.primary} size={30} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#2c3e50',
        padding: 10,
        fontFamily: 'Poppins-Regular',
        width: '80%',
    }
});
