import { url } from '../components/urls'
import { ToastAndroid } from 'react-native'
const host = url()

export function MainLookup(callback, props) {
  // console.log(props)
  const { method, endpoint, data, token, csrf } = props
  let jsonData;
  if (data) {
    jsonData = JSON.stringify(data)
  }
  const xhr = new XMLHttpRequest()
  const url = `${host}${endpoint}`
  xhr.responseType = "json"
  xhr.open(method, url)
  xhr.setRequestHeader("Content-Type", "application/json")
  if (token) {
    xhr.setRequestHeader('Authorization', `Token ${token}`)
  }
  xhr.setRequestHeader("Referer", host)
  if (csrf) {
    // console.log(csrf.csrf)
    xhr.setRequestHeader("X-CSRFToken", csrf)
  }
  xhr.onload = function () {
    var response = xhr.response
    var statusCode = xhr.status
    // console.log(response , statusCode,29)
    callback(response, statusCode)
  }
  xhr.send(jsonData)
}