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
import Strapi from '../api/Strapi';

export default SearchDocument = ({navigation}) =>{
    const [searchVal, setSearhVal] = useState('');
    const [data, setData] = useState([]);
    useEffect(()=>{
      if(searchVal.length >= 3){
        const api = new Strapi();
        api.findPassport(searchVal).then(res => {
          console.log(res)
          setData(res)
        }).catch(function (error) {
          console.log(error);
          return error
        });
      }
    },[searchVal])
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
            onChangeText={(e) => {
              setSearhVal(e)
            }}
          />
        </View>

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
                  <ListItem.Title>
                    <Text>
                      {item.code} - {item.name}
                    </Text>
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    <Text>{item.status}</Text>
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            );
        })}
      </ScrollView>

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
  