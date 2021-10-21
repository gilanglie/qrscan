import React,{useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Button,
    Alert,
    ToastAndroid,
} from "react-native";
import {
  Text,
  Header,
    ListItem,
    Icon,
    Card,
    Badge,
    Overlay,
    Input
} from "react-native-elements";  
import Strapi from '../api/Strapi';

export default SearchDocument = (props) =>{
    const [searchVal, setSearhVal] = useState('');
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false)
    const [sel, setSel] = useState({})
    const handleSearch = () =>{
      const api = new Strapi(props.auth.baseURL, false);
      api.findPassport(searchVal).then(res => {
        console.log(res)
        setData(res)
      }).catch(function (error) {
        console.log(error);
        return error
      });
    }
    const handleDelete = (val) =>{
      Alert.alert("Warning",
      "Anda harus melakukan scan ulang dokumen di box yang benar. \nApakah anda yakin?" ,
      [{
        text: "Ya hapus",
        onPress: (e) => {
          const api = new Strapi(props.auth.baseURL, false);
          api.deletePassport(val).then(res => {
            console.log(res)
            ToastAndroid.show('Barcode '+ val +' berhasil dihapus' , ToastAndroid.LONG);
            // setData(res)
            setVisible(false)
            handleSearch();
          }).catch(function (error) {
            ToastAndroid.show('Barcode '+ val +' gagal dihapus' , ToastAndroid.LONG);
            console.log(error);
            return error
          });
        }
      },{
        text: "Batalkan",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      }
      ]
      )
    } 
    return(
    <>
        <View style={styles.view}>
          <Icon
            style={{ marginRight: 5 }}
            name="search"
            size={30}
            color="black"
          />
          <Input
            placeholder="Search Document..."
            keyboardType={"default"}
            value={searchVal}
            onChangeText={e=>{setSearhVal(e)}}
          />
          
        </View>
        <Button 
            onPress={e=>{handleSearch()}}
          title="Search"
          />
            
      <ScrollView
        style={{
          margin: 16,
          padding: 6,
          backgroundColor: "white",
          elevation: 2,
        }}
      >
        {data.map((item, index) => {
          // console.log('item',item  )
          if (data.length > 0)
            return (
              <ListItem
                key={index}
                bottomDivider
                // onPress={() => showData(item.datas, item.name)}
              >
                <ListItem.Content>
                  <TouchableOpacity
                  onPress={e=>{
                    setVisible(true) 
                    setSel(item)}}
                  >
                  <ListItem.Title>
                    <Text>
                      {item.code} - {item.name}
                    </Text>
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    <Text>{item.status}</Text>
                  </ListItem.Subtitle>
                  </TouchableOpacity>
                </ListItem.Content>
              </ListItem>
            );
        })}
      </ScrollView>
      <Overlay isVisible={visible} 
      onBackdropPress={e=>{setVisible(false)}}
      >
      <View 
        style={{padding: 12}}>
            <Text h4 style={{textAlign: 'center',marginBottom: 24}}>Box : {sel.archiveName}</Text>
            <Text>Code : {sel.code}</Text>
            <Text>Name : {sel.name}</Text>
            <Text>Date Birth : {sel.dateBirth}</Text>
            <Text>Date Print : {sel.datePrint}</Text>
            <Text>No Passport : {sel.noPassport}</Text>
            <Text>Gender : {sel.gender}</Text>
            <Text>Type : {sel.type}</Text> 
            <Text>Status : {sel.status}</Text>
      </View>
      <Button title="Delete" color="red"
      onPress={e=>{handleDelete(sel.code)}}
      />
      </Overlay>
    </>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    view: {
        backgroundColor: 'white',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 24,
        paddingRight: 24,
        margin: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
      marginBottom: 5,
      flexDirection: "row",
    }
  });
  