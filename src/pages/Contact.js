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
import HomeCard from '../components/HomeCard';
export default Contact = (props) =>{
    return(
        <Card>
        <View>
          <HomeCard auth={props.auth}/>
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 10,
              marginTop: 24,
            }}
          >
            <Text style={{ marginBottom: 4, color: "orange" }}>
              {"New Archiving Managment"}
            </Text>
            <Text
              style={{
                marginBottom: 4,
                color: "black",
                fontSize: 14,
                lineHeight: 18,
              }}
            >
              {"V1.0"}
            </Text>
            <Text
              style={{
                marginBottom: 4,
                fontSize: 14,
                lineHeight: 18,
              }}
            >
              {"7/14/2021"}
            </Text>
          </View>
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 10,
            }}
          >
            <Text
              style={{
                marginBottom: 4,
                color: "black",
                fontSize: 14,
                lineHeight: 18,
              }}
            >
              Kantor Wilayah Kementrian Hukum dan HAM Sumatra Utara BELAWAN
              (TPI)
            </Text>
            <Text
              style={{
                marginBottom: 4,
                fontSize: 14,
                lineHeight: 18,
              }}
            >
              JL. SERMA HANAFIAH NO.1, KEL. BELAWAN I, KEC. MEDAN BELAWAN,
              MEDAN, SUMATERA UTARA 20411
            </Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
              }}
            >
              Telp.(061)-6941008 Faks.(061)-6941754 HP.087869003061
            </Text>
          </View>
        </View>
      </Card>
    )
}