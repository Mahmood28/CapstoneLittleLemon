import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Image, Pressable, Text, StyleSheet, TextInput, ScrollView, Dimensions} from 'react-native';
import { MaskedTextInput } from "react-native-mask-text";
import { CheckBox, Separator } from "react-native-btr";
//import * as Font from 'expo-font';

const validateEmail = (email) => {
    return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const headerHeight = windowHeight * 0.1;

const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const [validEmail, setValidEmail] = useState(false);
    const [validFirstName, setValidFirstName] = useState(false);
    const [validLastName, setValidLastName] = useState(false);

    const onChangeFirstName = (e) => {
        if (userData.firstname.length > 0 || e != ' ') {  // skip leading spaces
          setUserData({...userData, firstname: e});
        }
        setValidFirstName(userData.firstname.length > 0);
      }
    
      const onChangeLastName = (e) => {
        if (userData.lastname.length > 0 || e != ' ') {  // skip leading spaces
          setUserData({...userData, lastname: e});
        }
        setValidLastName(userData.lastname.length > 0);
      }
    
      const onChangeEmail = (e) => {
        setUserData({...userData, email: e});
        setValidEmail(validateEmail(userData.email));
      };
    
      const onChangePhone = (e) => {
        setUserData({...userData, phone: e});
      };
    

    const getUserData = async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            console.log("In ProfileScreen: gelesener userDataStr", userDataStr);
            const data = userDataStr != null ? JSON.parse(userDataStr) : null;
            setUserData(data);
        } catch (error) {
            // TODO: Handle error of not stored userData - return to OnboardingScreen
            console.log(error);
        }
    }

    const getUserDataWrapper = async () => {
        await getUserData();
    }

    // const loadFont = async () => {
    //     await Font.loadAsync({
    //       'MarkaziText': require('../assets/fonts/MarkaziText-Regular.ttf'),
    //     });
    // }

    // const loadFontWrapper = async () => {
    //     await loadFont();
    //     setFontLoaded(true);
    // }

    useEffect(() => {
        console.log("In ProfileScreen: useEffect");
        getUserDataWrapper();
        // loadFontWrapper();
    }, []);

    return (
        <>
        <View style = {styles.headercontainer}>
            <Image
            style={styles.headerimage}
            source={require('../img/Logo.png')}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel={'Little Lemon Logo Grey'}
            />
            <Image
                style={styles.avatarImageHeadline}
                source={require('../img/Profile.png')}
                resizeMode="center"
                accessible={true}
                accessibilityLabel={'Avatar'}
            />
                       
        </View>
        <ScrollView style={styles.container}>
        
            <Text style={styles.regularText}>
                Personal Information
            </Text>

            <View style={styles.innerContainer1}>
                <Image
                    style={styles.avatarImage}
                    source={require('../img/Profile.png')}
                    resizeMode="contain"
                    accessible={true}
                    accessibilityLabel={'Avatar'}
                />
                <Pressable
                    onPress={() => {console.log("Change")}}
                    disabled={false}
                    style={ styles.buttonEnabledGreenRound }>
                    <Text style={styles.buttonTextWhite}>Change</Text>
                </Pressable>
                <Pressable
                    onPress={() => console.log("Remove")}
                    disabled={false}
                    style={ styles.buttonEnabledWhite }>
                    <Text style={styles.buttonTextGreen}>Remove</Text>
                </Pressable>
            </View>

            <Text style={{...styles.inputHeadline, marginTop: 10}}>
                First Name
            </Text>
            <TextInput
                style={styles.inputBox}
                value={userData.firstname}
                onChangeText={onChangeFirstName}
                placeholder={userData.firstname}
                keyboardType="default"
            />

            <Text style={{...styles.inputHeadline, marginTop: 10}}>
                Last Name
            </Text>
            <TextInput
                style={styles.inputBox}
                value={userData.lastname}
                onChangeText={onChangeLastName}
                placeholder={"enter your last name"}
                keyboardType="default"
            />

            <Text style={{...styles.inputHeadline, marginTop: 10}}>
                Email
            </Text>
            <TextInput
                style={styles.inputBox}
                value={userData.email}
                onChangeText={onChangeEmail}
                placeholder={userData.email}
                keyboardType={'email-address'}
            />

            <Text style={{...styles.inputHeadline, marginTop: 10}}>
                Phone number
            </Text>
            <MaskedTextInput
                mask="+1 (999) 999-9999"
                style={styles.inputBox}
                value={userData.phone}
                onChangeText={onChangePhone}
                placeholder={"+1 (999) 999-9999"}
                keyboardType="phone-pad"
            />

            <Text style={styles.regularText}>
                Email notifications
            </Text>

            <View style={styles.checkboxRow}>
                <CheckBox
                    checked={userData.orderStatus}
                    color="#495E57"
                    disabled={false}
                    onPress={() => {
                        setUserData({...userData, orderStatus: !userData.orderStatus});
                    }}
                />
                <Text style={styles.checkboxLabel}>Order status</Text>
            </View>       
       
            <View style={styles.checkboxRow}>
                <CheckBox
                    checked={userData.passwordChanges}
                    color="#495E57"
                    disabled={false}
                    onPress={() => {
                        setUserData({...userData, passwordChanges: !userData.passwordChanges});
                    }}
                />
                <Text style={styles.checkboxLabel}>Password changes</Text>
            </View>

            <View style={styles.checkboxRow}>
                <CheckBox
                    checked={userData.specialOffers}
                    color="#495E57"
                    disabled={false}
                    onPress={() => {
                        setUserData({...userData, specialOffers: !userData.specialOffers});
                    }}
                />
                <Text style={styles.checkboxLabel}>Special offers</Text>
            </View>

            <View style={styles.checkboxRow}>
                <CheckBox
                    checked={userData.newsletter}
                    color="#495E57"
                    disabled={false}
                    onPress={() => {
                        setUserData({...userData, newsletter: !userData.newsletter});
                    }}
                />
                <Text style={styles.checkboxLabel}>NewsLetter</Text>
            </View>

            <Pressable
                onPress={() => {console.log("Logout")}}
                disabled={false}
                style={ styles.buttonEnabledLogout }>
                <Text style={styles.buttonTextBlack}>Log out</Text>
            </Pressable>

            <View style={styles.innerContainer2}>
                <Pressable
                    onPress={() => console.log("Discard changes")}
                    disabled={false}
                    style={ styles.buttonEnabledWhiteRoundBig }>
                    <Text style={styles.buttonTextGreen}>Discard changes</Text>
                </Pressable>
                <Pressable
                    onPress={() => {console.log("Save changes")}}
                    disabled={false}
                    style={ styles.buttonEnabledGreenRoundBig }>
                    <Text style={styles.buttonTextWhite}>Save changes</Text>
                </Pressable>
            </View>

        </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderWidth: 2,
        borderRadius: 20,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        paddingBottom:10,
    },
    innerContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingRight: 40,
        alignItems: 'center',
    },
    innerContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    avatarImage: {
        width: 80,
        height: 80,
    },
    regularText: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 8,
        marginTop: 10,
        color: 'black',
        textAlign: 'left',
      },
      buttonDisabled: {
        padding: 6,
        borderColor: 'grey',
        backgroundColor: 'grey',
        borderWidth: 2,
        borderRadius: 6,
        width: 80,
      },
      buttonEnabledGreenRound: {
        padding: 6,
        borderColor: '#495E57',
        backgroundColor: '#495E57',
        borderWidth: 2,
        borderRadius: 6,
        width: 80,
      },
      buttonEnabledGreenRoundBig: {
        padding: 6,
        borderColor: '#495E57',
        backgroundColor: '#495E57',
        borderWidth: 2,
        borderRadius: 6,
        width: 140,
      },
      buttonEnabledWhite: {
        padding: 6,
        borderColor: '#495E57',
        backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: 0,
        width: 80,
      },
      buttonEnabledWhiteRoundBig: {
        padding: 6,
        borderColor: '#495E57',
        backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: 6,
        width: 140,
      },
      buttonTextWhite: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
      },
      buttonTextGreen: {
        color: '#495E57',
        textAlign: 'center',
        fontSize: 16,
      },
      inputHeadline: {
        fontSize: 11,
        fontWeight: 'bold',
        padding: 4,
        marginTop: 10,
        color: '#495E57',
        textAlign: 'left',
      },
      inputBox: {
        marginRight: 10,
        marginVertical: 2,
        borderWidth: 1,
        borderRadius: 8,
        padding: 6,
        paddingLeft: 10,
        fontSize: 15,
        color: '#495E57',
        textAlign: 'left',
        borderColor: '#495E57',
        backgroundColor: 'white',
        width: 280,
      },
      checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      },
      checkboxLabel: {
        fontSize: 15,
        color: '#495E57',
        textAlign: 'left',
        paddingLeft:15
      },
      buttonEnabledLogout: {
        padding: 6,
        borderColor: '#F4CE14',
        backgroundColor: '#F4CE14',
        borderWidth: 2,
        borderRadius: 9,
        width: '100%',
        alignSelf: 'center',
        marginTop: 20,
      },
      buttonTextBlack: {
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
      },
      headercontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
      },
      headerimage: {
        height: 70,
        marginStart: 10,
      },
      avatarImageHeadline: {
        width: 60,
        height: 60,
        marginEnd: 10,
        borderRadius: 100,
      
      

      
 
    },
});

export default ProfileScreen;