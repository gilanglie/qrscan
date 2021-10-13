import React,{useEffect,DevSettings} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    View,
} from 'react-native';
import { Header, ListItem, Icon, Card, Switch } from "react-native-elements";
import HomeCard from '../components/HomeCard';
import { useNavigation } from '@react-navigation/native';
import RNRestart from 'react-native-restart'; // Import package from node modules
import AsyncStorage from '@react-native-async-storage/async-storage';



const listMenu = [
    {
      title: "Search Document",
      icon: "search",
      navigate: "Search Document",
    },
    {
      title: "Box Information",
      icon: "folder",
      navigate: "BoxInformation",
    },
    {
      title: "WNI Archiving",
      icon: "qrcode",
      navigate: "ScanQRWNI",
    },
    {
      title: "WNA Archiving",
      icon: "qrcode",
      navigate: "ScanQRWNA",
    },
    // {
    //   title: "User Role Information",
    //   icon: "lock",
    //   navigate: "UserInformation",
    // },
    {
      title: "e-Nam Contact",
      icon: "question",
      navigate: "Contact",
    },
  ];

export default Home = (props) => {
    const navigation = useNavigation();
    useEffect(()=>{
      if(props.logout){
        console.log(props.logout)
        handleLogout();
        RNRestart.Restart();
      }
    },[props.logout])

    const handleLogout = async () =>{
      try {
          await AsyncStorage.clear()
          console.log('logout')
      } catch(e) {
        console.log('errr',e)
        // error reading value
      }
    }
    return(
    <ScrollView
    style={{backgroundColor: 'white'}}
    contentInsetAdjustmentBehavior="automatic"
    >
        <HomeCard auth={props.auth} />
        {listMenu.map((item, i) => (
            <ListItem
              key={i}
              bottomDivider
              onPress={(e) =>
                // console.log('asdsadsa')
                item.navigate
                  ? navigation.navigate(item.title) 
                  : alert("Comming Soon!")
              }
            >
              <Icon
                name={item.icon}
                type="font-awesome"
              />
              <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
    </ScrollView>
    )
}