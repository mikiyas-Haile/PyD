import { StyleSheet, Text, View, Image, useColorScheme } from 'react-native';
import { DateAdded } from '../../Functions/DateAdded';
import React from 'react';
import colors from '../../components/colors';
import AntDesign from 'react-native-vector-icons/AntDesign'


export default function UserProfilePicture(props) {
    const { User } = props;
    const size = props.size ? props.size : 50
    const date = props.date ? props.date : null
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    try {
        if (date) {
            return (
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <ProfilePicture User={User} size={size} />
                        <View>
                            <Text style={{
                                color: textColor,
                                fontFamily: 'Noto-Bold',
                                fontSize: 15
                            }}>
                                {User.display_name} @{User.username}
                            </Text>
                            <Text style={{ color: textColor, fontFamily: 'Noto-Regular' }}>
                                {DateAdded(date)}
                            </Text>
                        </View>
                    </View>
                </View>
            )
        }
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                <ProfilePicture User={User} size={size} />
                {/* <Text>{User.username}</Text> */}
                {
                    date ?
                        <>
                            <Text style={{
                                color: textColor,
                                fontFamily: 'Noto-Regular'
                            }}>
                                {DateAdded(date)}
                            </Text>
                        </> : null
                }
            </View>
        );
    } catch (e) {
        console.log(e)
        return <Text>Loading..</Text>
    }
}

function ProfilePicture(props) {
    const { User, size } = props
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? 'white' : 'black';
    const bgColor = isDarkMode ? 'black' : 'white';
    try {
        if (User.pfp) {
            return (
                <Image style={{
                    backgroundColor: 'grey',
                    width: size,
                    height: size,
                    borderRadius: 100,
                    marginRight: 10
                }} source={{ uri: User.pfp }} />
            )
        } else {
            return (
                <AntDesign name='user' size={size} color={colors.primary} />
            )
        }
    } catch (e) {
        console.log(e)
        return <Text>Loading...</Text>
    }
}

const styles = StyleSheet.create({});
