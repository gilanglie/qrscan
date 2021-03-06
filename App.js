/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState,useEffect} from 'react';
import type {Node} from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import Login from './src/pages/Login';
import Home from './src/pages/Home';
import SearchDocument from './src/pages/SearchDocument';
import ScanWNI from './src/pages/scan/ScanWNI';
import ScanWNA from './src/pages/scan/ScanWNA';
import Contact from './src/pages/Contact';
import Archive from './src/pages/Archive';
import Config from './src/pages/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  const [manual, setManual] = useState(false);
  const [auth, setAuth] = useState(false);
  const [host, setHost] = useState('');
  const [box, setBox] = useState(false);
  const [logout, setLogout] = useState(false);

  useEffect(()=>{
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@auth')
        const box = await AsyncStorage.getItem('@box') 
        console.log('host',host)
        if(value !== null) {
          var auth = JSON.parse(value);
          setAuth(auth)
          setHost(auth.baseURL)
          setBox(JSON.parse(box))
        }
        // if(host !== null) {
        //   setHost(host)
        // }

      } catch(e) {
        // error reading value
      }
    }
    getData();
  },[])

  return (
    <ThemeProvider>
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
          // headerShown: false
          headerStyle: {
            backgroundColor: '#305997',
          },
          headerTintColor: '#fff',
        }}
      >
        {!auth ?
          <Stack.Screen name="Login" component={Login} />
        : 
          <Stack.Screen name="Home"  
            options={{
              headerRight: () => (
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingHorizontal: 15,
                  }}
                  onPress={() => setLogout(true)}
                >
                    <Icon name="sign-out" type="font-awesome" color="white" />
                </TouchableOpacity>
              ),
            }}>
          {props => <Home {...props} logout={logout} auth={auth}  />}
          </Stack.Screen>
        }
        <Stack.Screen name="Search Document"> 
            {props => <SearchDocument {...props} auth={auth} host={host} />}
          </Stack.Screen>
        {/* <Stack.Screen name="Search Document" auth={auth} host={host} component={SearchDocument}/> */}
          <Stack.Screen name="WNI Archiving"
            options={{
              headerRight: () => (
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingHorizontal: 15,
                  }}
                  onPress={() => manual ? setManual(false) : setManual(true)}
                >
                  {manual ? (
                    <Icon name="qrcode" type="font-awesome" color="white" />
                  ) : (
                    <Icon name="pencil" type="font-awesome" color="white" />
                  )}
                </TouchableOpacity>
              ),
            }}
          >
          {props => <ScanWNI {...props} box={box} auth={auth} host={host} manual={manual} />}
          </Stack.Screen>
          <Stack.Screen name="WNA Archiving"
            options={{
              headerRight: () => (
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingHorizontal: 15,
                  }}
                  onPress={() => manual ? setManual(false) : setManual(true)}
                >
                  {manual ? (
                    <Icon name="qrcode" type="font-awesome" color="white" />
                  ) : (
                    <Icon name="pencil" type="font-awesome" color="white" />
                  )}
                </TouchableOpacity>
              ),
            }}
          >
            {props => <ScanWNA {...props} box={box} host={host} auth={auth} manual={manual} />}
          </Stack.Screen>
          <Stack.Screen name="e-Nam Contact"> 
            {props => <Contact {...props} auth={auth}  />}
          </Stack.Screen>
          <Stack.Screen name="Box Information"> 
            {props => <Archive {...props} auth={auth} host={host} />}
          </Stack.Screen>
          <Stack.Screen name="Config"> 
            {props => <Config {...props} auth={auth} host={host} newHost={e => setHost(e)} />}
          </Stack.Screen>
          {/* <Stack.Screen name="Box Information" component={Archive}/> */}
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
    </ThemeProvider>
  );
};


export default App;
