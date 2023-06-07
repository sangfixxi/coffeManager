import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Woo Hoo!</Text>

      <Text style={styles.content}>Mật khẩu của bạn đã được thiết lập lại thành công! Bây giờ hãy đăng nhập bằng mật khẩu mới của bạn.</Text>

      <TouchableOpacity style={styles.buttonContinue} onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.buttonContinueText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    height: 70,
    marginTop: 80,
  },
  content:{
    fontSize: 12,
    marginLeft: 50,
    marginRight: 50,
    height: 50,
    textAlign: 'center'
  },
  buttonContinue: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 65,
    marginBottom: 10,
    width: '80%',
  },
  buttonContinueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
