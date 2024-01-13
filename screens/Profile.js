import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Image, Pressable, Text, StyleSheet, TextInput, ScrollView, Dimensions} from 'react-native';
import { MaskedTextInput } from "react-native-mask-text";
import { CheckBox, Separator } from "react-native-btr";
import * as ImagePicker from 'expo-image-picker';
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
    const [dummy, setDummy] = useState();

    const onChangeFirstName = (e) => {
        if (userData.firstname.length > 0 || e != ' ') {  // skip leading spaces
          setUserData({...userData, firstname: e});
        }
        setValidFirstName(userData.firstname.length > 0);
      }
    
      const onChangeLastName = (e) => {
        if ((userData.lastname != null && userData.lastname.length > 0) || e != ' ') {  // skip leading spaces
          setUserData({...userData, lastname: e});
        }
        setValidLastName(userData.lastname != null && userData.lastname.length > 0);
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

    

    // const saveChanges = async () => {
    // try {
    //     await AsyncStorage.setItem('userData', JSON.stringify(userData));
    //     console.log('User data saved successfully');
    // } catch (error) {
    //     console.log('Error saving user data', error);
    // }
    // };

    const LogoTitle = () => {
        return (
            <Image
                style={{ height: 70, resizeMode: 'contain' }}
                source={require('../img/Logo.png')}
            />
        );
    }

    const AvatarTitle = () => {
        return (
            <Image
                style={{ width: 50, height: 50, resizeMode: 'contain'}}
                source={require('../img/Profile.png')}
            />
        );
    }

    const updateHeader = () => {
        navigation.setOptions({
            headerTitle: (props) => <LogoTitle {...props} />,
            headerRight: (props) => <AvatarTitle {...props} />,
            headerLeft: () => (
                <Pressable
                    onPress={() => {
                        console.log("In ProfileScreen: updateHeader");
                        //navigation.navigate('Home');
                    }}
                    disabled={false}
                    style={{borderColor: '#495E57',backgroundColor: '#495E57',borderWidth: 0,borderRadius: 20,width: 40, padding: 0,margin: 0,height: 40}}
                    >  
                <Text style={{color: 'white',textAlign: 'center',fontSize: 22,fontWeight: 'bold'}}>&larr;</Text>
                </Pressable>
            )
        }
        )
    }

    clearAllAsyncStorage = async () => {
        try {
          await AsyncStorage.clear()
        } catch(e) {
          // clear error
        }
        console.log('Clear Done.')
      }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        console.log("In ProfileScreen: pickImage");
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1,
            });
            console.log('Result imagePicker: ',result);
            if (!result.canceled) {
                console.log('Result imagePicker not canceled, userData: ', userData);
                return (result.assets[0].uri);
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const updateAvatar = async () => {
        console.log("In ProfileScreen: updateAvatar, before pickImage(), userData.avatarImage: ",userData.avatarImage);
        let uri = await pickImage();
        console.log("In ProfileScreen: updateAvatar after pickImage: uri: ",uri);
        if (uri != null) {
            setUserData({...userData, avatarImage: uri});
        }
        console.log("In ProfileScreen: updateAvatar, AFTER pickImage(), userData.avatarImage: ",userData.avatarImage);
    }

    const Avatar = () => {
        if (userData.avatarImage != null) {
            return (
                <Pressable
                    onPress={() => {
                        console.log("In Avatar onPress");
                        updateAvatar();
                        console.log("In Avatar onPress after updateAvatar");
                    }}>
                    <Image
                        style={styles.avatarImage}
                        source={userData.avatarImage}
                        resizeMode="contain"
                        accessible={true}
                        accessibilityLabel={'Avatar'}
                    />
                </Pressable>
            );
        } else {
            return (
                <Pressable
                    onPress={() => {
                        console.log("In Avatar onPress");
                        updateAvatar();
                        console.log("In Avatar onPress after updateAvatar");
                    }}>
                    <View style={{ ...styles.avatarImage, borderRadius: 40, backgroundColor: '#495E57', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>GS</Text>
                    </View>
                </Pressable>
            );

        }  
    }

    useEffect(() => {
        console.log("In ProfileScreen: useEffect");
        getUserDataWrapper();
        // loadFontWrapper();
        updateHeader();
    }, []);

    return (
        <>
        <ScrollView style={styles.container}>
        
            <Text style={styles.regularText}>
                Personal Information
            </Text>

            <View style={styles.innerContainer1}>
                <Avatar />
                <Pressable
                    onPress={() => {console.log("Change"); updateHeader()}}
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
                onPress={() => {console.log("Logout"); clearAllAsyncStorage(); navigation.navigate('Onboarding')}}
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
        borderRadius: 40,
        borderColor: 'lightgrey',
        borderWidth: 1,
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