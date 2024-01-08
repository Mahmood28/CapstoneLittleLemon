import React, { useState } from 'react';
import {
  View,
  Image,
  Pressable,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { validateEmail } from '../utils';

const SubscribeScreen = () => {
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const onChangeEmail = (e) => {
    setEmail(e);
    setValidEmail(validateEmail(email));
  };

  const showAlert = () => {
    const alarmText =
      'Thanks for subscribing with your email ' + email + '.\nStay tuned!';
    Alert.alert('Thank you!', alarmText);
    setEmail('');
    setValidEmail(false);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../img/little-lemon-logo-grey.png')}
        resizeMode="contain"
        accessible={true}
        accessibilityLabel={'Little Lemon Logo'}
      />
      <Text style={styles.regularText}>
        Subscribe to our newsletter for our latest delicious recipes!
      </Text>
      <TextInput
        style={styles.inputBox}
        value={email}
        onChangeText={onChangeEmail}
        placeholder={'Type your email'}
        keyboardType={'email-address'}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={showAlert}
          disabled={!validEmail}
          style={validEmail ? styles.button : styles.buttonDisabled}>
          <Text style={styles.buttonText}>Subscribe</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  regularText: {
    fontSize: 22,
    padding: 20,
    color: 'black',
    textAlign: 'center',
  },
  inputBox: {
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    paddingLeft: 10,
    fontSize: 18,
    borderColor: 'black',
    backgroundColor: 'white',
    width: 280,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    padding: 4,
    borderColor: '#406050',
    backgroundColor: '#406050',
    borderWidth: 1,
    borderRadius: 8,
    width: 280,
  },
  buttonDisabled: {
    padding: 4,
    borderColor: 'grey',
    backgroundColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    width: 280,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default SubscribeScreen;
