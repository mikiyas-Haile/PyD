import React from 'react'
import { MainLookup } from '../lookup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firebase from "firebase";

export function PostHandler(callback, props) {
    const { data, endpoint } = props
    const method = props.method ? props.method : 'POST'
    const TokenCallBack = (error, token) => {
        if (token) {
            const cab = (response, code) => {
                if (response.csrf) {
                    const cb = (res, code) => {
                        callback(res, code)
                    }
                    MainLookup(cb, { endpoint, data, csrf: response.csrf, method, token })
                }
            }
            MainLookup(cab, { endpoint: '/csrf', method: 'GET', token })
        }
    }
    AsyncStorage.getItem("Token", TokenCallBack)
}

const UploadImage = async (endpoint, url, callBack) => {
    const response = await fetch(url);
    const path = `/b/${endpoint}/${Math.random().toString(36)}/o`
    const blob = await response.blob();
    const task = firebase
        .storage()
        .ref()
        .child(path)
        .put(blob);
    const taskProgress = snapshot => {
        callBack(`transferred: ${snapshot.bytesTransferred}`, 200)
    }
    const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
            callBack(snapshot, 201)
        })
    }
    const taskError = snapshot => {
        callBack(snapshot, 500);
    }
    task.on("state_changed", taskProgress, taskError, taskCompleted);
}
export default UploadImage;