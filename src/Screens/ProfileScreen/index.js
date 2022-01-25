import { BackHandler, ActivityIndicator, View, Text, TextInput, Dimensions, TouchableOpacity, useColorScheme, Image, Modal, ToastAndroid, Platform, StyleSheet, FlatList } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MainLookup } from '../../lookup'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../../components/colors'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import { PostHandler } from '../../components/post'
import UploadImage from '../../components/post'
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "@react-navigation/native"
import { DateAdded } from '../../Functions/DateAdded/index'

const Tab = createMaterialTopTabNavigator();
const { height, width } = Dimensions.get('window')

export default function ProfileScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';

    return (
        <MainPage />
        // <Tab.Navigator
        //     screenOptions={{
        //         tabBarIndicatorStyle: { backgroundColor: "#2c3e50", },
        //         tabBarLabelStyle: { textTransform: 'none', fontFamily: "Bold", color: textColor, },
        //         tabBarPressColor: colors.primary,
        //         tabBarStyle: { backgroundColor: bgColor },
        //         swipeEnabled: false,
        //     }} initialRouteName='Profile Home' style={{ backgroundColor: bgColor }}>
        //     <Tab.Screen name='Profile Home' options={{ title: 'Home' }} component={MainPage} />
        //     <Tab.Screen name='Profile Posts' options={{ title: 'Posts' }} component={MainPage} />
        // </Tab.Navigator>
    )
}

function MainPage() {
    const [changeMade, setChangeMade] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [token, setToken] = useState(false)
    const [profile, setProfile] = useState([])
    const [username, setUsername] = useState()
    const [DisplayName, setDisplayName] = useState()
    const [Email, setEmail] = useState()
    const [Bio, setBio] = useState()
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    const nav = useNavigation();
    const [image, setImage] = useState({
        image: false,
        url: null
    })
    useEffect(() => {
        const eb = (error, response) => {
            if (response) {
                setToken(response)
                const callback = (r, c) => {
                    if (c === 200) {
                        setProfile(r)
                        nav.setOptions({
                            title: r.username ? r.username : 'Home'
                        })
                    }
                }
                MainLookup(callback, { endpoint: `/api/bank`, token: response, method: 'GET' })
            }
        }
        AsyncStorage.getItem('Token', eb)
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.cancelled) {
            setChangeMade(true)
            setImage({ image: true, url: result.uri })
        }
    };
    const UpdateProfile = (url) => {
        let data = {};
        if (url) {
            data['pfp'] = url
        }
        if (Bio) {
            data['bio'] = Bio;
        }
        if (username) {
            data['username'] = username;
        } else {
            data['username'] = profile.username
        }
        if (Email) {
            data['email'] = Email;
        }
        if (DisplayName) {
            data['display_name'] = DisplayName;
        }
        const callback = (r, c) => {
            setLoading(false)
            setChangeMade(false)
            if (c === 200) {
                setProfile(r)
                if (Platform.OS === 'android') {
                    ToastAndroid.show("Profile Updated successfully.", 30)
                } else {
                    alert("Profile Updated successfully.")
                }
            }
        }
        PostHandler(callback, { endpoint: `/api/update-profile`, data, method: 'PUT' })
    }
    const HandleUpdate = () => {
        setLoading(true)
        if (image.image) {
            const cb = (response, code) => {
                console.log(response, 88)
                if (code === 201) {
                    UpdateProfile(response)
                } else if (code === 500) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show("There was an error trying to post your Pfp. Please try again.", 30)
                    } else {
                        alert("There was an error trying to post your Pfp. Please try again.")
                    }
                } else {
                    console.log(response)
                }
            }
            UploadImage(`pfps/${profile.username}`, image.url, cb);
        } else {
            UpdateProfile()
        }
    }
    return (
        <>
            <View style={{ flex: 1, backgroundColor: bgColor }}>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={pickImage}>
                        {profile.pfp || image.url ?
                            <Image style={{ width: 100, height: 100, borderRadius: 100 }} source={{ uri: image.url ? image.url : profile.pfp }} /> :
                            <AntDesign name='adduser' size={50} color={colors.primary} />}
                    </TouchableOpacity>
                    <TextInput
                        style={{ fontSize: 17, fontFamily: 'Noto-Bold', width: '100%', color: textColor }}
                        onChangeText={(val) => (setDisplayName(val), setChangeMade(true))}
                        textAlign='center'
                        value={DisplayName}
                        placeholderTextColor={'grey'}
                        defaultValue={profile.display_name}
                        placeholder='Enter name here'
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <TextInput
                            value={username}
                            autoCapitalize='none'
                            textAlign='center'
                            style={{ fontSize: 17, fontFamily: 'Noto-Regular', width: '100%', color: textColor }}
                            placeholderTextColor={'grey'}
                            onChangeText={(val) => (setUsername(val), setChangeMade(true))}
                            defaultValue={profile.username ? profile.username : '-'}
                        />
                    </View>
                    <TextInput
                        style={{ fontSize: 17, fontFamily: 'Noto-Regular', width: '100%', color: textColor }}
                        onChangeText={(val) => (setEmail(val), setChangeMade(true))}
                        placeholderTextColor={'grey'}
                        value={Email}
                        textAlign='center'
                        autoCapitalize='none'
                        keyboardType={"email-address"}
                        autoComplete={'email'}
                        defaultValue={profile.email}
                        placeholder='Enter Email here'
                    />
                    <TextInput
                        style={{ fontSize: 17, fontFamily: 'Noto-Regular', width: '100%', color: textColor }}
                        onChangeText={(val) => (setBio(val), setChangeMade(true))}
                        placeholderTextColor={'grey'}
                        value={Bio}
                        textAlign='center'
                        defaultValue={profile.bio}
                        placeholder='Enter Your Bio here'
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width / 1.2 }}>
                        <Text style={{ fontSize: 13, fontFamily: 'Noto-Regular', color: textColor }}>
                            Cash: {profile.cash_in_hand}
                        </Text>
                        <Text style={{ fontSize: 20, color: textColor }}>•</Text>
                        <Text style={{ fontSize: 13, fontFamily: 'Noto-Regular', color: textColor }}>
                            Bank: {profile.cash_in_bank}
                        </Text>
                        <Text style={{ fontSize: 20, color: textColor }}>•</Text>
                        <Text style={{ fontSize: 13, fontFamily: 'Noto-Regular', color: textColor }}>
                            Savings: {profile.cash_in_savings}
                        </Text>
                        <TouchableOpacity onPress={() => (nav.push("Top-up Account"))}>
                            <Ionicons name='add' size={30} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Transactions token={token} />
            </View>
            <View style={{ position: 'absolute', bottom: 50, right: 10 }}>
                {changeMade ?
                    <TouchableOpacity onPress={HandleUpdate}>
                        <Ionicons name='checkmark-circle' size={70} color={colors.primary} />
                    </TouchableOpacity> : null}
                {changeMade ?
                    <TouchableOpacity onPress={() => (
                        setUsername(profile.username),
                        setEmail(profile.email),
                        setDisplayName(profile.DisplayName),
                        setChangeMade(false)
                    )}>
                        <Ionicons name='close' size={70} color={colors.primary} />
                    </TouchableOpacity> : null}
            </View>
            <Modal
                animated
                animationType={"fade"}
                statusBarTranslucent
                visible={Loading}
                transparent>
                <View style={[styles.overlay, { alignItems: 'center', justifyContent: 'center' }]}>
                    <ActivityIndicator size={'large'} color={textColor} />
                </View>
            </Modal>
        </>
    );
}

function Transactions(props) {
    const { token } = props
    const [transactions, setTransactions] = useState([])
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    useEffect(() => {
        const timer = setInterval(() => {
            if (token) {
                const callback = (r, c) => {
                    if (c === 200) {
                        setTransactions(r)
                    }
                }
                MainLookup(callback, { endpoint: `/api/transactions`, method: 'POST', token: token })
            }
        }, 10000)
        return () => clearInterval(timer);
    })
    const RenderTransaction = ({ item, index }) => {
        return (
            <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#2c3e50', padding: 10, margin: 3 }}>
                <Text style={{ color: textColor, fontFamily: 'Bold' }}>{item.name}</Text>
                <Text style={{ color: textColor, fontFamily: 'Noto-Regular' }}>Time: {DateAdded(item.date_added)}</Text>
                <Text style={{ color: textColor, fontFamily: 'Noto-Regular' }}>Transaction Id {item.id}</Text>
            </View>
        )
    }

    return (
        <Tab.Navigator screenOptions={{
            tabBarScrollEnabled: true,
            tabBarIndicatorStyle: { backgroundColor: "#2c3e50", },
            tabBarLabelStyle: { textTransform: 'none', fontFamily: "Bold", color: textColor },
            tabBarStyle: { backgroundColor: bgColor, borderColor: '#2c3e50', borderBottomWidth: 1, borderTopWidth: 1 },
            tabBarPressColor: colors.primary,
        }}>
            <Tab.Screen name='Your Transactions' children={() => (
                <FlatList backgroundColor={bgColor} data={transactions.your_transactions} renderItem={RenderTransaction} />
            )} />
            <Tab.Screen name='Your Sent Logs' children={() => (
                <FlatList backgroundColor={bgColor} data={transactions.sent_logs} renderItem={RenderTransaction} />
            )} />
            <Tab.Screen name='Your Recieve Logs' children={() => (
                <FlatList backgroundColor={bgColor} data={transactions.receive_logs} renderItem={RenderTransaction} />
            )} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        justifyContent: 'flex-end',
    },
})