import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPasswordScreen() {
  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true); // State để xác định tính hợp lệ của tên đăng nhập

  const navigation = useNavigation();

  const handleResetPassword = async () => {
    // Kiểm tra tính hợp lệ của tên đăng nhập
    if (username.trim() === '') {
      setIsUsernameValid(false);
      return;
    }

    // Gọi API kiểm tra xác minh tên đăng nhập
    try {
      const response = await fetch(
        'https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account'
      );
      const data = await response.json();
      const user = data.find((user) => user.username === username);

      if (user) {
        // Tên đăng nhập hợp lệ, chuyển đến màn hình đặt lại mật khẩu và truyền giá trị username
        navigation.navigate('ResetPasswordScreen', { username: user.username });
      } else {
        // Tên đăng nhập không hợp lệ
        setIsUsernameValid(false);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Khôi phục lại mật khẩu của bạn</Text>

      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icon_username.png')}
          style={styles.inputIcon}
          resizeMode="contain"
        />
        <TextInput
          style={[styles.input, !isUsernameValid && styles.inputInvalid]}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {!isUsernameValid && (
        <Text style={styles.errorText}>Tên đăng nhập không hợp lệ</Text>
      )}

      <TouchableOpacity
        style={styles.buttonContinue}
        onPress={handleResetPassword}>
        <Text style={styles.buttonContinueText}>Tiếp tục</Text>
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
    height: 120,
    marginTop: 80,
  },
  input: {
    width: '80%',
    height: 40,
    paddingHorizontal: 15,
  },
  buttonContinue: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '80%',
  },
  buttonContinueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: '80%',
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputIcon: {
    height: 30,
    marginLeft: 15,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputInvalid: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
