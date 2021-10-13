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
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  const [manual, setManual] = useState(false);
  const [auth, setAuth] = useState(false);
  const [logout, setLogout] = useState(false);

  useEffect(()=>{
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@auth')
        if(value !== null) {
          const loginData = JSON.stringify(value)
          const login = JSON.parse(value)
          // value previously stored
          setAuth(login)
        }
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
        <Stack.Screen name="Search Document" auth={auth} component={SearchDocument}/>
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
          {props => <ScanWNI {...props} auth={auth} manual={manual} />}
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
            {props => <ScanWNA {...props} auth={auth} manual={manual} />}
          </Stack.Screen>
          <Stack.Screen name="e-Nam Contact"> 
            {props => <Contact {...props} auth={auth} manual={manual} />}
          </Stack.Screen>
          <Stack.Screen name="Box Information"> 
            {props => <Archive {...props} auth={auth} manual={manual} />}
          </Stack.Screen>
          {/* <Stack.Screen name="Box Information" component={Archive}/> */}
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
    </ThemeProvider>
  );
};


export default App;
