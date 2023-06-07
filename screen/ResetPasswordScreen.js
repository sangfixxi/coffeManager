import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

export default function ResetPasswordScreen({ route, navigation }) {
  const { username } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enteredSecurityCode, setEnteredSecurityCode] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  useEffect(() => {
    retrieveSecurityCode();
  }, []);

  const retrieveSecurityCode = async () => {
    try {
      const code = await AsyncStorage.getItem('securityCode');
      if (code) {
        setSecurityCode(code);
      }
    } catch (error) {
      console.error('Error retrieving security code from AsyncStorage:', error);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      // Handle error for empty password
      return;
    }
    if (newPassword !== confirmPassword) {
      // Handle error for mismatched passwords
      return;
    }
    if (enteredSecurityCode !== securityCode) {
      // Handle error for incorrect security code
      setIsErrorModalVisible(true);
      return;
    }

    try {
      // Send password change request to API
      const response = await fetch(
        'https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account'
      );
      const data = await response.json();
      const user = data.find((user) => user.username === username);

      if (user) {
        // Update password for the user
        await requestPasswordChange(user.id, newPassword);

        // Reset form fields
        setNewPassword('');
        setConfirmPassword('');
        setEnteredSecurityCode('');

        // Navigate to the password reset success screen
        navigation.navigate('FinishResetPasswordScreen');
      } else {
        // Handle error for user not found
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const requestPasswordChange = async (employeeId, newPassword) => {
    try {
      const updatedEmployee = {
        password: newPassword,
      };

      await fetch(
        `https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account/${employeeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedEmployee),
        }
      );

      // Handle success for password change request
    } catch (error) {
      console.error('Error sending password change request:', error);
      // Handle error for password change request
    }
  };

  const closeModal = () => {
    setIsErrorModalVisible(false); // Hide error modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lại mật khẩu của bạn</Text>

      <Text style={styles.content}>
        Vui lòng nhập mật khẩu mới và xác nhận mật khẩu.
      </Text>

      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icon_password.png')}
          style={styles.inputIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
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
          placeholder="Xác nhận mật khẩu"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/icon_code.jpg')}
          style={styles.inputIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder="Mã bảo mật"
          value={enteredSecurityCode}
          onChangeText={setEnteredSecurityCode}
        />
      </View>

      <TouchableOpacity
        style={styles.buttonContinue}
        onPress={handleResetPassword}>
        <Text style={styles.buttonContinueText}>Đặt lại mật khẩu</Text>
      </TouchableOpacity>

      {/* Error Modal */}
      <Modal isVisible={isErrorModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Đặt lại mật khẩu thất bại</Text>
          <Text style={styles.modalText}>
            Mã bảo mật không chính xác. Vui lòng thử lại.
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  content: {
    fontSize: 12,
    marginLeft: 50,
    marginRight: 50,
    height: 50,
    textAlign: 'center',
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
