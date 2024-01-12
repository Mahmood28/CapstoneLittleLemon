import React, { useState } from 'react';
import {
    View,
    Image,
    Pressable,
    Text,
    StyleSheet,
  } from 'react-native';

const ProfileScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Profile Screen</Text> 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
    },
});

export default ProfileScreen;