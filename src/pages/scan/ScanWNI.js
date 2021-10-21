import React,{useState, Fragment} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    Alert,
    TouchableOpacity,
    TextInput,
    ToastAndroid 
  } from "react-native";
import { RNCamera } from 'react-native-camera';
import WNI from '../../api/WNI';
import Strapi from '../../api/Strapi';
import { Card } from 'react-native-elements/dist/card/Card';
import Spinner from 'react-native-loading-spinner-overlay';
import RNRestart from 'react-native-restart'; // Import package from node modules
import ModalData from '../../components/ModalData';

export default ScanWNI = (props,{ navigation }) => {
    const [readBarcode, setReadBarcode] = useState(true);
    const [code, setCode] = useState('');    
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(false)

    const barcodeRecognized = ({barcodes}) => {
        if(barcodes.length > 0){
            // console.log(barcodes[0].data)
            setReadBarcode(false)
            findData(barcodes[0].data, 'wni')
        }
    };
    const handleLogout = async () =>{
        try {
            await AsyncStorage.clear()
            console.log('logout')
        } catch(e) {
          console.log('errr',e)
          // error reading value
        }
      } 

    const findData = (val,type) => {
        setLoading(true)
        console.log(props.auth.baseURL, props.auth.baseURL)
        const api = new Strapi(props.auth.baseURL, props.auth.baseURL);
        api.apiSearch(val,type).then(result => {
            console.log('result',result)
            
            if(Object.keys(result).length > 0){
                console.log('res',result)
                setData(result)
                setVisible(true)
                setLoading(false)
            }else{
                ToastAndroid.show('Barcode '+ val +' not valid!', ToastAndroid.LONG);
                setTimeout(() => {
                    setLoading(false)
                    setReadBarcode(true)
                }, 2500);
            }
        }).catch(err => {
            Alert.alert(
                "Warning",
                "ada kemungkinan server berubah, login ulang ?",
                [
                    {
                    text: "Ya",
                    onPress: (e) => {
                        handleLogout();
                        RNRestart.Restart();
                    }
                    },
                    {
                    text: "Batalkan",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                    }
                ]
            )
            console.log(err)
        })
        // console.log('data',result);  
    }
    return(
        <>
        <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{color: 'white'}}
        />
        {!props.manual ?
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
                    <Text style={{backgroundColor:'white',padding: 12,color:'black'}}>Scan QR from document</Text>

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
        : 
        <Card>
            <TextInput
                placeholder="Input Nomor Permohonan..."
                keyboardType={"default"}
                value={code}
                onChangeText={(e) => {
                    setCode(e);
                }}
            />
            <Button
                title={"Confirm"}
                onPress={e => {findData(code, 'wni')}}
            />
        </Card>
        }
        <View>
        <ModalData visible={visible} onClose={e=> {
            setVisible(e)
            setReadBarcode(true)
        }} data={data} box={props.box} host={props.host} auth={props.auth.baseURL} />

        </View>
        </>
    )
}