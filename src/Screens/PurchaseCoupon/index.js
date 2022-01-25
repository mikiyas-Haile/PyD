import { Modal, View, Text, TextInput, useColorScheme, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../components/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PostHandler } from '../../components/post'
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native'
const { height, width } = Dimensions.get("window")

export default function PurchaseCoupon() {
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    const TextStyles = { alignSelf: 'center', color: textColor, fontFamily: 'Noto-Regular', fontSize: 30, marginVertical: 20 }
    const nav = useNavigation();
   
    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: bgColor, padding: 20 }}>
                <Text style={[TextStyles, { fontFamily: 'Bold', color: colors.primary }]}>Hello.</Text>
                <Text style={TextStyles}>Here, You will Top-up your account balance.</Text>
                <Text style={TextStyles}>Now. I assume that you have your Coupon already on your hands.</Text>
                <View>
                    <Text style={TextStyles}>Please scratch the card to reveal the QR code.</Text>
                    <Text style={TextStyles}>Your Secret key should be a mixture of numbers, words and a "#".</Text>
                    <TouchableOpacity
                        onPress={() => (
                            nav.push("Scan Coupon")
                        )}
                        style={{
                            backgroundColor: colors.primary,
                            width: width / 1.2,
                            borderRadius: 30,
                            padding: 10,
                            marginBottom: 50,
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }} >
                        <Text
                            style={{
                                fontFamily: 'Black',
                                fontSize: 17
                            }}>Proceed to Scan</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
}

export function ScanCoupon() {
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    const [couponId, setCouponId] = useState()
    const [scan, setScan] = useState(false)
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const nav = useNavigation();
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const SubmitCoupon = (couponId) => {
        if (couponId) {
            const approved = couponId.includes("#")
            const list = couponId.split("#")
            const id = list[1]
            const testTwo = isNaN(id)
            if (approved && !testTwo) {
                const callback = (r, c) => {
                    console.log(r, c)
                    nav.reset({
                        index: 0,
                        routes: [{ name: 'Home Page' }],
                    })
                    if (c === 201) {
                        alert(r)
                    }
                    if (c === 400) {
                        if (r.id) {
                            alert("The secret key you entered was invalid. Please try again.")
                        }
                    }
                }
                PostHandler(callback, { data: { id: couponId }, endpoint: `/api/top-up` })
            } else {
                alert("The QR Code you scanner was invalid. Please try again.")
            }
        }
    }
    return (
        <View style={[styles.overlay, { alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }]}>
                <Camera onBarCodeScanned={(data) => {
                        SubmitCoupon(data.data)
                }} style={styles.camera} type={type}>
                </Camera>
                </View>
    )
}

const styles = StyleSheet.create({
    camera: {
        height: height / 1.5,
        width: width
    },
    overlay: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'flex-end',
    },
})