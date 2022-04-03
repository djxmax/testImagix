/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { Image, Button, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { PermissionsAndroid } from 'react-native';
import WifiManager from "react-native-wifi-reborn";

//Nom et mot de passe du réseau wifi
const ssid = "Magiline";
const password = "azertyuiop";


const App = () => {
  //hook permettant de gérer le loader
  const [connecting, setConnecting] = useState(false);

  //fonction du bouton
  const connect = () => {
    setConnecting(true);
    requestLocationPermission();
  }

  //demande l'autorisation sur android de la localisation. Sans celle ci impossible d'utiliser le réseau wifi
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Une autorisation de localisation est requise pour les connexions WiFi',
            'message': 'Cette application a besoin d\'accéder à votre localisation afin de pouvoir trouver les réseaux wifi'
          }
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Acces a la localisation OK");
          connectWifi();
        } else {
          setConnecting(false);
          Alert.alert('Impossible d\'accéder aux connexions Wifi');
        }
      } catch (err) {
        setConnecting(false);
        Alert.alert('Impossible d\'accéder aux connexions Wifi');
        console.warn(err)
      }
    } else {
      console.log("Acces a la localisation OK");
      connectWifi();
    }
  }

  //fonction de connexion au wifi
  const connectWifi = async () => {
    WifiManager.setEnabled(true);
    try {
      const data = await WifiManager.connectToProtectedSSID(
        ssid,
        password,
        false,
      );
      setConnecting(false);
      console.log('Connected successfully!', { data });
      Alert.alert('Connexion avec le réseau wifi établis.');
      getWifiInfosInLog();
    } catch (error) {
      setConnecting(false);
      Alert.alert('Impossible de se connecter au réseau Wifi');
      console.log('Connection failed!', { error });
    }
  };

  //contruction de la page
  return(
    <View style={styles.container}>
      <View style={styles.componentsContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('./img/logo.png')}
          />
        </View>
        <View style={styles.buttonContainer}>
          {connecting ? null : (
            <Button 
            title="Je me connecte"
            color={COLORS.primary}
            onPress={connect}
          />
          )}
          
          {connecting ? (<ActivityIndicator id="test" size="large" color={COLORS.primary} />) : null}
        </View>
        <View style={styles.magilineLogoContainer}>
          <Image
            style={styles.magilineLogo}
            source={require('./img/logo2.png')}
          />
        </View>
      </View>
    </View>
  )
};

//definition des couleurs
export const COLORS = {
  primary: '#f18e02',
  background: '#1e3a53',
}

//CSS de la page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  backgroundimage: {
    flex: 1,
    justifyContent: "center"
  },
  componentsContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  logoContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: 'contain'
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center'
  }, 
  button: {
  },
  magilineLogoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  magilineLogo: {
    width:150,
    height:150,
    resizeMode: 'contain'
  }
});

//Fonction supplémentaire pour afficher les infos du réseau wifi dans les logs
const getWifiInfosInLog = async() => {
  WifiManager.getIP().then(ip => {
    console.log("Current Ip " + ip);
  },
  () => {
    console.log("Cannot get IP");
  })
  WifiManager.getCurrentSignalStrength().then(signal => {
    console.log("Current signal strength " + signal);
  },
  () => {
    console.log("Cannot get signal strength");
  })
}

export default App;
