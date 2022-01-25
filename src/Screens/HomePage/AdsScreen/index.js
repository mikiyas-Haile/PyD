import { View, Text, ScrollView, useColorScheme, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLookup } from '../../../lookup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserProfilePicture from '../../../Elements/UserProfilePicture/index'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import colors from '../../../components/colors';
import { useNavigation } from '@react-navigation/native'
import { PostHandler } from '../../../components/post'

export default function AdsScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    const [ads, setAds] = useState([])
    const [sending, setSending] = useState(false)
    const [body, setBody] = useState()
    useEffect(() => {
        const timer = setInterval(() => {
            const eb = (error, response) => {
                if (response) {
                    setInterval(() => {
                        const callback = (r, c) => {
                            if (c === 200) {
                                setAds(r)
                            }
                        }
                        MainLookup(callback, { endpoint: `/api/create-ad`, token: response, method: 'GET' })
                    }, 1000)
                }
            }
            AsyncStorage.getItem('Token', eb)
        }, 10000)
        return () => clearInterval(timer)
    })
    const SendAd = () => {
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
            PostHandler(callback, { endpoint: `/api/create-ad`, data: { content: body, docs: 'null#null' } })
        }
    }
    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: bgColor }}>
                {ads.map(item => {
                    return (
                        <View key={item.id} >
                            <AdvertismentCard item={item}/>
                        </View>
                    )
                })}
            </ScrollView>
            {sending ?
                <Text style={{ paddingLeft: 30, fontFamily: 'Bold', color: textColor, backgroundColor: bgColor }}>
                    Posting Ad..
                </Text> : null}
            <View style={{ backgroundColor: bgColor, padding: 5, flexDirection: 'row', justifyContent: 'space-around', marginTop: 'auto' }}>
                <TextInput
                    multiline
                    onChangeText={(val) => setBody(val)}
                    maxLength={240}
                    value={body}
                    data-name='body'
                    placeholderTextColor={'grey'}
                    placeholder='Make a quick Ad..'
                    style={[styles.input, { color: textColor } ]}
                    autoFocus
                />
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={SendAd}>
                    <FontAwesome name='send' color={colors.primary} size={30} />
                </TouchableOpacity>
            </View>
        </>
    );
}

export function AdvertismentCard(props) {
    const item = props.item
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    const nav = useNavigation()
    return (
        <View key={item.id} style={{
            borderColor: '#2c3e50',
            borderWidth: 1,
            borderRadius: 20,
            padding: 10,
            margin: 5,
            flexDirection: 'row'
        }}>
            <View>
                <UserProfilePicture date={item.date_added} User={item.author} />
                <View>
                    <Text style={{
                        color: textColor,
                        fontFamily: 'Noto-Regular',
                        fontSize: 17
                    }}>
                        {item.content}
                    </Text>
                </View>
            </View>
            <View style={{ marginLeft: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                {item.is_me ? null :
                    <TouchableOpacity onPress={() => (nav.push("Send User Message", { UserProfile: item.author }))}>
                        <EvilIcons name='envelope' size={50} color={colors.primary} />
                    </TouchableOpacity>}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#2c3e50',
        padding: 5,
        fontFamily: 'Poppins-Regular',
        width: '80%',
    }
});