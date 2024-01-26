import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
  } from 'react-native';

const SplashScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.headerimage}
                source={require('../img/Logo.png')}
                resizeMode="contain"
                accessible={true}
                accessibilityLabel={'Little Lemon Logo'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
    },
    headerimage: {
        width: '90%',
        height: '80%',
        marginVertical: 30,
      },
});

export default SplashScreen;