import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStateContext } from "../GlobalStateProvider";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../styles/Theme";

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const OnboardingScreen = ({ navigation }) => {
  const [
    ,
    ,
    ,
    setIsOnboardingCompleteTrue,
  ] = React.useContext(GlobalStateContext);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e);
  };

  const onChangeFirstName = (e) => {
    if (firstname.length > 0 || e !== " ") {
      // skip leading spaces
      setFirstname(e);
    }
  };

  const onChangeLastName = (e) => {
    if (lastname.length > 0 || e !== " ") {
      // skip leading spaces
      setLastname(e);
    }
  };

  const isFormValid = () => {
    return validateEmail(email) && firstname.trim().length > 0 && lastname.trim().length > 0;
  };

  const storeUserInfo = async () => {
    let userData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      avatarImage: null,
      phone: null,
      orderStatus: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
    };
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setIsOnboardingCompleteTrue();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Data not stored",
        "Your input data could not be stored. Please try again"
      );
    }

    return;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.logo}
            source={require("../img/Logo.png")}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel={"Little Lemon Logo"}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Little Lemon!</Text>
          <Text style={styles.subtitle}>Let us get to know you</Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstname}
                onChangeText={onChangeFirstName}
                placeholder="Enter your first name"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="default"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastname}
                onChangeText={onChangeLastName}
                placeholder="Enter your last name"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="default"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={onChangeEmail}
                placeholder="Enter your email address"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <Pressable
            onPress={() => storeUserInfo()}
            disabled={!isFormValid()}
            style={[
              styles.nextButton,
              isFormValid() ? styles.nextButtonEnabled : styles.nextButtonDisabled
            ]}
          >
            <Text style={[
              styles.nextButtonText,
              isFormValid() ? styles.nextButtonTextEnabled : styles.nextButtonTextDisabled
            ]}>
              Get Started
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  logo: {
    height: 80,
    width: '100%',
    maxWidth: 300,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.background,
  },
  welcomeTitle: {
    fontSize: Typography.displayMedium,
    fontWeight: Typography.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.title,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.body,
    fontWeight: Typography.semiBold,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body,
    color: Colors.text,
    backgroundColor: Colors.background,
    ...Shadows.small,
  },
  nextButton: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.medium,
  },
  nextButtonEnabled: {
    backgroundColor: Colors.buttonPrimary,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  nextButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.semiBold,
  },
  nextButtonTextEnabled: {
    color: Colors.text,
  },
  nextButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});

export default OnboardingScreen;
