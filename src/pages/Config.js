import React,{useEffect, useState} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    View,
    ToastAndroid,
    TextInput
} from 'react-native';
import { Header, ListItem, Icon, Card, Switch } from "react-native-elements";
import { RNCamera } from 'react-native-camera';
import base64 from 'base-64';
import utf8 from 'utf8';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart'; // Import package from node modules
var isBase64 = require('is-base64');

 

export default Config = (props) => {
    const handleIp = (e) =>{
        // console.log(e)
        if(e.length > 0 ){
          storeData(e)
        }else{
          storeData('http://172.20.10.2:1337/')
          
        }
    }
    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('@host', value)
          props.newHost(value)
        } catch (e) {
          // saving error
        //   ToastAndroid.show('Login error!,silahkan coba lagi' , ToastAndroid.LONG);
        }
      }
      
    return(
      <View style={{padding:24}}>
        {/* <TextInput
            defaultValue={props.host}
            onChangeText={e=> handleIp(e)}
            placeholder="Input Host Server"
        /> */}
        <Text>API URL : {props.auth.baseURL}</Text>
        <Text>ROLE : {props.auth.role}</Text>
        <Text>NAME : {props.auth.name}</Text>
        <Text>Limit Archive : {props.auth.doc_limit}</Text>
      </View>
        // <RNCamera
        //     ref={ref => {
        //     camera = ref;
        //     }}
        //     style={{ 
        //     flex: 1,
        //     width: '100%',
        //     }}
        //     onGoogleVisionBarcodesDetected={e=> {readBarcode ? barcodeRecognized(e) : null}}
        //     >
        // </RNCamera>
    )
}