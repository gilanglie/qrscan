import React,{useState} from 'react';

import {
    Text,
    Image,
    View,
    ToastAndroid,
} from 'react-native';

import { Button, Overlay,ListItem, Icon, Card, Switch } from "react-native-elements";
import Strapi from '../api/Strapi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default ModalData = (props) => {
    const [code,setCode] = useState('')
    const storeData = async (value) => {
        try {
          let data = {
              box: value.name,
              limit: value.limit - 1
          }
          await AsyncStorage.setItem('@box', data.toString())
        } catch (e) {
          // saving error
        //   ToastAndroid.show('Login error!,silahkan coba lagi' , ToastAndroid.LONG);
        }
      }
  const handleSave = () => {
    console.log(props.auth)
    const api = new Strapi(props.host, props.auth);
    var val = props.data.code
    api.findPassportbyCode(val).then(res => {
        console.log('find passport', res)
        if(res.length == 0){
            // save to box archive
            let data = {
                "code": props.data.code,
                "name": props.data.name,
                "dateBirth": props.data.dateBirth,
                "datePrint": props.data.datePrint,
                // "noKTP": props.data.gender,
                "noPassport": props.data.noPassport,
                "gender": props.data.gender,
                "type": props.data.type,
                "status": props.data.status,
            }
            api.listArchive(props.data.type == 'paspor' ? 'wni' : 'wna')
            .then(res=>{
                // console.warn('list archive', res)
                if(res.length == 0){
                    let arcData = {
                        name : 'Box 1',
                        status : 'Active',
                        type : props.data.type == 'paspor' ? 'wni' : 'wna'
                    }
                    console.log('arcdata',arcData,props.data)
                    api.createArchive(arcData)
                    .then(res => {
                        console.log('create arc', res)
                        data["archiveName"] = res
                        // console.log('data',data)
                        api.createPassport(data).then(res => {
                            console.log('create pass', res)
                            ToastAndroid.show('Barcode '+ val +' ditambahkan ke ' + arcData.name , ToastAndroid.LONG);
                            storeData({name:res,limit:props.auth.doc_limit})
                            setCode('')
                        })
                    })    
                }else{
                    data["archiveName"] = res[0].name
                    var limit = props.auth.doc_limit;
                    api.countPassportinArchive(res[0].name).then(res => {
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
                                                storeData({name:res[0].name,limit:res[0].limit})
                                                ToastAndroid.show('Barcode '+ val +' ditambahkan ke ' + res[0].name , ToastAndroid.LONG);
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
                                            type : props.data.type == 'paspor' ? 'wni' : 'wna',
                                            limit: limit
                                        }
                                        api.createArchive(arcData)
                                        .then(res => {
                                            // console.log('create arc', res)
                                            data["archiveName"] = res 
                                            // console.log('data',data)
                                            api.createPassport(data).then(res => {
                                                console.log('create pass', res)
                                                storeData({name:res,limit:props.auth.doc_limit})
                                                ToastAndroid.show('Barcode '+ val +' ditambahkan ke ' + res , ToastAndroid.LONG);
                                                setCode('')
                                            })
                                        })    
                                    }}
                                ]
                            );
                        }else{
                            api.createPassport(data).then(res => {
                                setCode('') 
                                console.log('res create pass',res)
                                storeData({name:res[0].name,limit:res[0].limit})
                                ToastAndroid.show('Barcode '+ val +' ditambahkan ke ' + res[0].name , ToastAndroid.LONG);
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
  }
  const handleClose = () => {
    console.log('wewew')
    props.onClose(false)
  }
  return (
      <Overlay isVisible={props.visible} 
      onBackdropPress={e=>{handleClose()}}
      >
      <View 
        style={{padding: 12}}>
            <Text>Code : {props.data.code}</Text>
            <Text>Name : {props.data.name}</Text>
            <Text>Date Birth : {props.data.dateBirth}</Text>
            <Text>Date Print : {props.data.datePrint}</Text>
            <Text>No Passport : {props.data.noPassport}</Text>
            <Text>Gender : {props.data.gender}</Text>
            <Text>Type : {props.data.type}</Text> 
            <Text>Status : {props.data.status}</Text>
            <Text>Box : {props.data.box}</Text>

      </View>
      <View style={{marginBottom: 4, marginTop: 12}}>
        <Button title="Save" onPress={e=>{handleSave()}} />
      </View>
      <View style={{marginBottom: 12, marginTop: 4}}>
        <Button title="Close"  onPress={e=>{handleClose()}} />
      </View>
      </Overlay>
    )
}