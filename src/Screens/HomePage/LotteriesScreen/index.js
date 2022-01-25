import { View, Text, ScrollView, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLookup } from '../../../lookup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserProfilePicture from '../../../Elements/UserProfilePicture/index'

export default function LotteriesScreen() {
    const [lotteries, setLotteries] = useState([])
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    useEffect(() => {
        const timer = setInterval(() => {
            const eb = (error, response) => {
                if (response) {
                    setInterval(() => {
                        const callback = (r, c) => {
                            if (c === 200) {
                                setLotteries(r)
                            }
                        }
                        MainLookup(callback, { endpoint: `/api/lottery/join`, token: response, method: 'GET' })
                    }, 1000)
                }
            }
            AsyncStorage.getItem('Token', eb)
        }, 10000)
        return ()=>clearInterval(timer)
    })

    return (
        <ScrollView style={{ flex: 1, backgroundColor: bgColor }}>
            {/* {lotteries.map(item => {
                return (
                    <View key={item.id}>
                        <Text><UserProfilePicture User={item.author} /></Text>
                        <Text>{item.content}</Text>
                    </View>
                )
            })} */}
        </ScrollView>
    );
}
