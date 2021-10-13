import React,{useState} from 'react';
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

export default ScanWNI = (props,{ navigation }) => {
    const [readBarcode, setReadBarcode] = useState(true);
    const [code, setCode] = useState('');    
    const barcodeRecognized = ({barcodes}) => {
        if(barcodes.length > 0){
            // console.log(barcodes[0].data)
            setReadBarcode(false)
            findData(barcodes[0].data, 'wni')
        }
    };
    
    const findData = (val,type) => {
        const api = new Strapi(false,props.auth.baseURL);
        api.apiSearch(val,type).then(result => {
            console.log('result',result)
            if(Object.keys(result).length > 0){
                console.log('res',result)
                api.findPassportbyCode(val, 'paspor').then(res => {
                    console.log('find passport', res)
                    if(res.length == 0){
                        // save to box archive
                        let data = {
                            "code": result.nomor_permohonan.toString(),
                            "name": result.nama_lengkap,
                            "dateBirth": result.tanggal_lahir,
                            "datePrint": result.tanggal_dikeluarkan,
                            "noKTP": result.no_ktp,
                            "noPassport": result.no_paspor,
                            "gender": result.jenis_kelamin,
                            "type": 'paspor',
                            "status": result.tahapan,
                        }
                        api.listArchive('wni')
                        .then(res=>{
                            // console.warn('list archive', res)
                            if(res.length == 0){
                                let arcData = {
                                    name : 'Box 1',
                                    status : 'Active',
                                    type : 'wni'
                                }
                                api.createArchive(arcData)
                                .then(res => {
                                    // console.log('create arc', res)
                                    data["archive"] = res.id
                                    // console.log('data',data)
                                    api.createPassport(data).then(res => {
                                        console.log('create pass', res)
                                        ToastAndroid.show('Barcode '+ val +' ditambahkan ke ' + res.archive.name , ToastAndroid.LONG);
                                        setCode('')
                                    })
                                })    
                            }else{
                                
                                data["archive"] = res[0].id
                                var limit = res[0].limit;
                                api.countPassportinArchive(res[0].id).then(res => {
                                    console.log('count',res)
                                    var count = res
                                    if(count.length >= limit){
                                        Alert.alert(
                                            "Warning",
                                            res[0].name + " sudah limit, apakah ingin tetap ditambahkan?",
                                            [
                                                {
                                                text: "Ya tambahkan",
                                                onPress: (e) => {
                                                    api.createPassport(data).then(res => {
                                                        console.log('create pass', res)
                                                        api.setArchive(res[0].id,'Inactive').then(res => {
                                                            setCode('') 
                                                            ToastAndroid.show('Barcode '+ val +' ditambahkan ke ' + res.archive.name , ToastAndroid.LONG);
                                                        })
                                                    })
                                                }
                                                },
                                                {
                                                text: "Batalkan",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                                },
                                                { text: "Masukkan di box baru", onPress: (e) => {
                                                    let arcData = {
                                                        name : Number("Box 1".replace( /^\D+/g, '')) + 1,
                                                        status : 'Active',
                                                        type : 'wni'
                                                    }
                                                    api.createArchive(arcData)
                                                    .then(res => {
                                                        // console.log('create arc', res)
                                                        data["archive"] = res.id 
                                                        // console.log('data',data)
                                                        api.createPassport(data).then(res => {
                                                            console.log('create pass', res)
                                                            ToastAndroid.show('Barcode '+ val +' ditambahkan ke ' + res.archive.name , ToastAndroid.LONG);
                                                            setCode('')
                                                        })
                                                    })    
                                                }}
                                            ]
                                        );
                                    }else{
                                        api.createPassport(data).then(res => {
                                            setCode('') 
                                            ToastAndroid.show('Barcode '+ val +' ditambahkan ke ' + res.archive.name , ToastAndroid.LONG);
                                        })
                                    }
                                })
                            }
                        })
                        .catch(err => 
                            console.log('err',err)   
                        )
                    }else{
                        ToastAndroid.show('Barcode '+ val +' exist! '  , ToastAndroid.LONG);
                    }
                }).catch(err => 
                    console.log('err',err)
                )
            }else{
                ToastAndroid.show('Barcode '+ val +' not valid!', ToastAndroid.LONG);
                setTimeout(() => {
                    setReadBarcode(true)
                }, 2500);
            }
        }).catch(err => {
            console.log(err)
        })
        // console.log('data',result);  
    }
    return(
        <>
        {!props.manual ?
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
        </>
    )
}