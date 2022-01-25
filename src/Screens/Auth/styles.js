import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const authStyles = StyleSheet.create({
    BackButton: { 
        position: 'absolute', 
        left: 10, 
        padding: 20, 
        top: 30 
    },
    container: {
        flex: 1,
        paddingTop: 50,
    },
    input: {
        fontFamily: 'Regular',
        fontSize: 20,
        margin: 10,
        padding: 2
    },
    warningContainers: { 
        position: 'absolute', 
        top: 0, 
        height: 150, 
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center' ,
        opacity: .9
    },
    MainActionText: { 
        fontFamily: 'Regular', 
        fontSize: 20 
    },
    MainActionButton: { 
        margin: 30, 
        borderRadius: 20, 
        padding: 10, 
        alignItems: 'center' 
    },
    WarningBoxText: {
        fontFamily: 'Regular', 
        fontSize: 17
    },
    WarningBoxContainer: {
        width: width / 1.2,
        borderRadius: 5,
        alignItems: 'center',
        margin: 1,
        borderColor: '#2c3e50',
        borderWidth: 1
    },
    TitleStyle: {
        fontFamily: 'Bold', 
        fontSize: 25 ,
        alignSelf: 'center'
    }
})

export default authStyles;