import React, { useState } from 'react';
import Modal from 'react-native-modal';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogin = async () => {
    try { 
      const response = await fetch(
        'https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account'
      );
      const data = await response.json();
      const user = data.find(
        (account) =>
          account.username === username && account.password === password
      );
      console.log('A')
      if (user) {
        if (user.type === 0) {
          navigation.navigate('HomeScreen_0');
        } else if (user.type === 1) {
          navigation.navigate('HomeScreen_1');
        }
      } else {
        setIsModalVisible(true); // Hiển thị popup lỗi
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      setIsModalVisible(true); // Hiển thị popup lỗi
    }
  };

  const closeModal = () => {
    setIsModalVisible(false); // Ẩn popup
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icon_account.png')}
        style={styles.iconAccount}
        resizeMode="contain"
      />

      <Text style={styles.title}>Đăng nhập</Text>

      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icon_username.png')}
          style={styles.inputIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icon_password.png')}
          style={styles.inputIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
        <Text style={styles.buttonLoginText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Popup lỗi */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Đăng nhập thất bại</Text>
          <Text style={styles.modalText}>
            Tên đăng nhập hoặc mật khẩu không đúng
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotPass}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  iconAccount: {
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    height: 50,
  },
  input: {
    width: '80%',
    height: 40,
    paddingHorizontal: 15,
  },
  buttonLogin: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '80%',
  },
  buttonLoginText: {
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
  forgotPass: {
    fontSize: 12,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
