import { View, Text, FlatList, useColorScheme, StyleSheet, Image, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MainLookup } from '../../../lookup';
import colors from '../../../components/colors';
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserProfilePicture from '../../../Elements/UserProfilePicture/index'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get("window")

export default function ChatListScreen() {
    const [chatRooms, setChatRooms] = useState([])
    const [token, setToken] = useState()
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    const nav = useNavigation();
    useEffect(() => {
        const timer = setInterval(() => {
            const callback = (response, status) => {
                if (status === 200) {
                    setChatRooms(response)
                }
            }
            MainLookup(callback, { method: 'GET', endpoint: `/api/my-chats`, token: token })
        }, 1000)
        return () => clearInterval(timer)
    })
    useEffect(() => {
        const cb = (e, r) => {
            if (r) {
                setToken(r)
            }
        }
        AsyncStorage.getItem("Token", cb)
    },[])
    return (
            <FlatList backgroundColor={ bgColor } data={chatRooms} renderItem={({item, index})=>(
                <>
                <Pressable onPress={()=>(nav.push("Send User Message", { UserProfile: item.you }))} style={{ flexDirection: 'row', padding: 10, borderWidth: 1, borderRadius: 20, borderColor: '#2c3e50', margin: 4, alignItems: 'center' }}>
                    <View style={{ marginRight: 10 }} ><UserProfilePicture User={item.you} /></View>
                    <View>
                        <Text style={{ color: textColor, fontFamily: "Bold", fontSize: 17 }} >{item.you.display_name}</Text>
                        <Text style={{ color: textColor, fontFamily: "Noto-Regular", fontSize: 14 }}>@{item.you.username}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>(nav.push("Send User Message", { UserProfile: item.you }))} style={{ marginLeft: 'auto' }}>
                        <MaterialIcons name='navigate-next' color={colors.primary} size={50} />
                    </TouchableOpacity>
                </Pressable>
                </>
            )} />
    );
}
