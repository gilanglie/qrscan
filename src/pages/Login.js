import React,{useState, Fragment} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    View,
    ToastAndroid
} from 'react-native';
import { Header, ListItem, Icon, Card, Switch } from "react-native-elements";
import { RNCamera } from 'react-native-camera';
import base64 from 'base-64';
import utf8 from 'utf8';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart'; // Import package from node modules
var isBase64 = require('is-base64');



export default Login = ({ navigation }) => {
    const [readBarcode, setReadBarcode] = useState(true);
    const barcodeRecognized = ({barcodes}) => {
        // console.log(barcodes)
        if(barcodes.length > 0){
            setReadBarcode(false)
            var encoded  = barcodes[0].data;
            if(isBase64(encoded)){
                var bytes = base64.decode(encoded);
                var text = utf8.decode(bytes);
                // console.log(text);
                var data = JSON.parse(text);
                if(Object.prototype.hasOwnProperty.call(data, "role")){
                    // console.log('yey')
                    storeData(text)
                    // navigation.navigate('Home')
                    RNRestart.Restart();
                }else{
                    setTimeout(() => {
                        setReadBarcode(true)
                    }, 2500);
                    // ToastAndroid.show('Barcode login salah! silahkan coba lagi' , ToastAndroid.SHORT);
                }
            }else{
                setTimeout(() => {
                    setReadBarcode(true)
                }, 2500);
                // ToastAndroid.show('Barcode login tidak valid! silahkan coba lagi' , ToastAndroid.SHORT);
            }
        }
    };
    
    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('@auth', value)
        } catch (e) {
          // saving error
          ToastAndroid.show('Login error!,silahkan coba lagi' , ToastAndroid.LONG);
        }
      }
      
    return(
        
        <Fragment>
            <RNCamera
                ref={ref => {
                camera = ref;
                }}
                style={{ 
                flex: 1,
                width: '100%',
                }}
                onGoogleVisionBarcodesDetected={e=> {readBarcode ? barcodeRecognized(e) : null}}
                >
            </RNCamera>
            <View style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
            }}>
            <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.7)",
            }}></View>
            <View style={{
                    flexDirection: "row",
                    flex: 1.5,
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.7)",
                }}></View>
                <View style={{
                    borderColor: "red",
                    borderWidth: 2,
                    flex: 6,
                }}>
                    <Text style={{backgroundColor:'white',padding: 12,color:'black'}}>Login QR from browser </Text>
                </View> 
                <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.7)",
                }}></View>
            </View>
            <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.7)",
            }}></View>
            </View>
    </Fragment>
    )
}