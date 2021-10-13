import React from 'react';

import {
    Text,
    Image,
    View,
} from 'react-native';

import { ListItem, Icon, Card, Switch } from "react-native-elements";


export default HomeCard = (props) => {
    return (
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../assets/CompanyLogo.jpeg")}
              resizeMode="stretch"
              style={{ width: 75, height: 75, borderRadius: 40 }}
            />
            <View
              style={{
                padding: 20,
              }}
            >
              <Text
              >
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
                {"Belawan Immiragrion Office"}
              </Text>
              <Text
                style={{
                  marginBottom: 4,
                  fontSize: 14,
                  lineHeight: 18,
                }}
              >
                Halo, {props.auth.name}
              </Text>
              {/* <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                }}
              >
                {"Phone"}
              </Text> */}
            </View>
          </View>
        </Card>
    )
}