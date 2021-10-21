import React,{useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    ToastAndroid,
    Pressable,
    PermissionsAndroid,
} from "react-native";
import {
    Header,
    ListItem,
    Icon,
    Card,
    Badge,
    Overlay,
    Input
} from "react-native-elements";  
import { Button } from 'react-native-elements/dist/buttons/Button';
import Strapi from '../api/Strapi';
import { writeFile, readFile } from 'react-native-fs';
var RNFS = require('react-native-fs');
import XLSX from 'xlsx';

export default Archive = (props,{navigation}) =>{
    const [selArc, setSelArc] = useState(false)
    const [data, setData] = useState([])

    useEffect(()=>{
        // console.log(props.auth.baseURL)
        const api = new Strapi(props.host, false);
        api.listArchive(selArc).then(res => {
            setData(res)
        })
        .catch(function (error) {
            console.log(error);
        });

    },[selArc])
    const handleActive = (id,status,name) => {
        var data = status == 'Active' ? 'Inactive' : 'Active';
        const api = new Strapi(props.host, false);
        api.setArchive(id,data).then(res => {
            ToastAndroid.show('Status ' +name +'telah ' + data == 'Active' ?  'di Unwrap' : 'di Wrap' , ToastAndroid.LONG);
            api.listArchive(selArc).then(res => {
                setData(res)
            })
            .catch(function (error) {
                console.log(error);
            });
        })
    }
    const handleDeleteArchive = (id) => {
        const api = new Strapi(props.host, false);
        api.countPassportinArchive(id).then(res=>{
            if(res.length == 0){
                var i = 0;
                res.forEach(data => {
                    i++;
                    api.deletePassport(data.id).then(resP => {
                        if (i == res.length){
                            api.deleteArchive(id).then(resA => {
                                ToastAndroid.show('Box berhasil dihapus' , ToastAndroid.LONG);
                                api.listArchive(selArc).then(res => {
                                    setData(res)
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                            })
                        }
                    })
                });
            }else{
                api.deleteArchive(id).then(resA => {
                    ToastAndroid.show('Box berhasil dihapus' , ToastAndroid.LONG);
                    api.listArchive(selArc).then(res => {
                        setData(res)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                })
            }
            
        })
    }
    const exportExcel = async (id,name) => {
        try{

        const api = new Strapi(props.host, false); 
        let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if(!isPermitedExternalStorage){
            // Ask for permission
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: "Storage permission needed",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
              }
            );
    
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // Permission Granted (calling our exportDataToExcel function)
                api.countPassportinArchive(id).then(res=>{
                    console.log(res)
                    let data = []
                    res.forEach(d => {
                    let val = {
                        code : d.code,
                        archive : d.archiveName,
                        name: d.name, 
                        gender : d.gender, 
                        dateBirth : d.dateBirth, 
                        // id: d.id, 
                        noKTP: d.noKTP, 
                        noPassport : d.noPassport, 
                        type: d.type, 
                        status: d.status, 
                        datePrint : d.datePrint, 
                        // created_at : d.created_at, 
                        // published_at: d.published_at,
                        // updated_at: d.updated_at
                    } 
                    data.push(val)
                    });
                    let wb = XLSX.utils.book_new();
                    let ws = XLSX.utils.json_to_sheet(data)    
                    XLSX.utils.book_append_sheet(wb,ws,name)
                    const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
                
                    // Write generated excel to Storage
                    RNFS.writeFile(RNFS.ExternalDirectoryPath   + '/'+ name.replace(/ /g,"_") + '_' + selArc +'.xlsx', wbout, 'ascii').then((r)=>{
                        // console.log('Success', RNFS.ExternalDirectoryPath );
                        ToastAndroid.show('Files disimpan di' + RNFS.ExternalDirectoryPath   + '/'+ name.replace(/ /g,"_") + '_' + selArc + '.xlsx',ToastAndroid.LONG)
                    }).catch((e)=>{
                        console.log('Error', e);
                    });

                })

              console.log("Permission granted");
            } else {
              // Permission denied
              console.log("Permission denied");
            }
          }else{ 
            api.countPassportinArchive(id).then(res=>{
                console.log(res)
                let data = []
                res.forEach(d => {
                   let val = {
                    code : d.code,
                    archive : d.archive.name,
                    name: d.name, 
                    gender : d.gender, 
                    dateBirth : d.dateBirth, 
                    // id: d.id, 
                    noKTP: d.noKTP, 
                    noPassport : d.noPassport, 
                    type: d.type, 
                    status: d.status, 
                    datePrint : d.datePrint, 
                    // created_at : d.created_at, 
                    // published_at: d.published_at,
                    // updated_at: d.updated_at
                   } 
                   data.push(val)
                });
                let wb = XLSX.utils.book_new();
                let ws = XLSX.utils.json_to_sheet(data)    
                XLSX.utils.book_append_sheet(wb,ws,name)
                const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
            
                // Write generated excel to Storage
                RNFS.writeFile(RNFS.ExternalDirectoryPath   + '/'+ name.replace(/ /g,"_") + '_' + selArc +'.xlsx', wbout, 'ascii').then((r)=>{
                    // console.log('Success', RNFS.ExternalDirectoryPath );
                    ToastAndroid.show('Files disimpan di' + RNFS.ExternalDirectoryPath   + '/'+ name.replace(/ /g,"_") + '_' + selArc + '.xlsx',ToastAndroid.LONG)
                }).catch((e)=>{
                    console.log('Error', e);
                });

            })
          }
    }catch(e){
        console.log('Error while checking permission');
        console.log(e);
        return
      }
    
    }
    return(
        <>
        {!selArc ?
        <> 
            <ListItem
                // key={index}
                bottomDivider
                onPress={() => setSelArc('wni')}
            >
                <ListItem.Content>
                <ListItem.Title>
                    <Text>WNI Box</Text>
                </ListItem.Title>
                </ListItem.Content>
            </ListItem>
                <ListItem
                // key={index}
                bottomDivider
                onPress={() => setSelArc('wna')}
            >
                <ListItem.Content>
                <ListItem.Title>
                    <Text>WNA Box</Text>
                </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </>
        : 
        <ScrollView>
            {data.map((item, index) => {
                if (data.length > 0)
                    return (
                    <ListItem
                        key={index}
                        bottomDivider
                        // onPress={() => showData(item.datas, item.name)}
                    >
                          <Badge

                            status={`${item.status == 'Inactive' ? "error" :  "success" }`}
                            textStyle={{ color: 'orange' }}
                            containerStyle={{ marginTop: -20 }}
                        />

                        <ListItem.Content>

                        <ListItem.Title style={{display:'flex'}}>
                            <Text>{item.name} - {item.status}</Text>
                        </ListItem.Title>
                        <View
                            style={{display: 'flex', flexDirection: 'row', marginTop: 10 }}
                        >
                                <Pressable
                                    onPress={e=>{
                                        Alert.alert(
                                            "Changing active box!",
                                            "Status " + item.name + " akan diubah?",
                                            [
                                              {
                                                text: "Cancel",
                                              },
                                              {
                                                text: "Ok",
                                                onPress: () => {
                                                  handleActive(item.id, item.status, item.name);
                                                },
                                              },
                                            ]
                                          );
                                    }}
                                    style={{marginRight: 20 }}
                                >
                                    <Icon
                                        name="save"
                                        size={30}
                                        color="blue"
                                    />
                                </Pressable>
                                <Pressable
                                    onPress={e=>{exportExcel(item.id,item.name)}}
                                    style={{marginRight: 20 }}
                                >
                                    <Icon
                                        name="file-excel-o"
                                        type="font-awesome"
                                        size={30}
                                        color="green"
                                    />
                                </Pressable>
                                <Pressable
                                    style={{marginRight: 20 }}
                                    onPress={e=>{
                                        Alert.alert(
                                            "Delete box!",
                                            item.name + " akan dihapus?",
                                            [
                                                {
                                                text: "Cancel",
                                                },
                                                {
                                                text: "Ok",
                                                onPress: () => {
                                                    handleDeleteArchive(item.id);
                                                },
                                                },
                                            ]
                                            );
                                    }}
                                >
                                    <Icon
                                        type="font-awesome"
                                        name="trash"
                                        size={30}
                                        color="red"
                                    />
                                </Pressable>
                                
                        </View>
                        </ListItem.Content>
                    </ListItem>
                    );
                })}
        </ScrollView>
        }
            
        </>
    )
}