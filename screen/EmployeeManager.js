import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmployeeManagementScreen() {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeUsername, setEmployeeUsername] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [employeeType, setEmployeeType] = useState(0); // 0: Quản lý, 1: Nhân viên
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [securityCode, setSecurityCode] = useState('');

  const navigation = useNavigation();
  
  useEffect(() => {
    fetchEmployees();
    retrieveSecurityCode();
  }, []);

  const generateSecurityCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSecurityCode(code);
    storeSecurityCode(code);
  };

  const retrieveSecurityCode = async () => {
    try {
      const code = await AsyncStorage.getItem('securityCode');
      if (code !== null) {
        setSecurityCode(code);
      }
    } catch (error) {
      console.error('Lỗi khi lấy mã bảo mật từ AsyncStorage:', error);
    }
  };

  const storeSecurityCode = async (code) => {
    try {
      await AsyncStorage.setItem('securityCode', code);
    } catch (error) {
      console.error('Lỗi khi lưu mã bảo mật vào AsyncStorage:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        'https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account'
      );
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách nhân viên:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const addEmployee = async () => {
    if (employeeName && employeeUsername && employeePassword) {
      const newEmployee = {
        id: Date.now().toString(),
        name: employeeName,
        username: employeeUsername,
        password: employeePassword,
        type: employeeType,
      };

      try {
        const response = await fetch(
          'https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
          }
        );
        const createdEmployee = await response.json();
        setEmployees([...employees, createdEmployee]);
        setEmployeeName('');
        setEmployeeUsername('');
        setEmployeePassword('');
        setEmployeeType(0);
      } catch (error) {
        console.error('Lỗi khi thêm nhân viên:', error);
      }
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(
        `https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account/${employeeId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        const updatedEmployees = employees.filter(
          (employee) => employee.id !== employeeId
        );
        setEmployees(updatedEmployees);
        console.log('Nhân viên đã được xóa thành công.');
      } else {
        console.error('Lỗi khi xóa nhân viên:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
    }
  };

  const editEmployee = async () => {
    if (
      selectedEmployee &&
      employeeName &&
      employeeUsername &&
      employeePassword
    ) {
      const updatedEmployee = {
        id: selectedEmployee.id,
        name: employeeName,
        username: employeeUsername,
        password: employeePassword,
        type: employeeType,
      };

      try {
        await fetch(
          `https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account/${selectedEmployee.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEmployee),
          }
        );
        const updatedEmployees = employees.map((employee) => {
          if (employee.id === selectedEmployee.id) {
            return updatedEmployee;
          }
          return employee;
        });
        setEmployees(updatedEmployees);
        setEmployeeName('');
        setEmployeeUsername('');
        setEmployeePassword('');
        setEmployeeType(0);
        setSelectedEmployee(null);
      } catch (error) {
        console.error('Lỗi khi cập nhật nhân viên:', error);
      }
    }
  };

  const selectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeName(employee.name);
    setEmployeeUsername(employee.username);
    setEmployeePassword(employee.password);
    setEmployeeType(employee.type);
  };

  const renderEmployeeList = () => {
    const filteredEmployees = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filteredEmployees.map((employee) => (
      <View key={employee.id} style={styles.employeeContainer}>
        <TouchableOpacity
          style={styles.employeeInfo}
          onPress={() => selectEmployee(employee)}>
          <Text style={styles.employeeName}>{employee.name}</Text>
          <Text style={styles.employeeType}>
            {employee.type === 0 ? 'Quản lý' : 'Nhân viên'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteEmployee(employee.id)}>
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          source={require('../assets/icon-employee-management.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Quản lý nhân viên</Text>
      </View>

      <View style={styles.securityCodeContainer}>
        <Text style={styles.securityCodeText}>Mã bảo mật:</Text>
        <Text style={styles.securityCodeValue}>{securityCode}</Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateSecurityCode}>
          <Text style={styles.generateButtonText}>Tạo mã bảo mật</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm nhân viên..."
          value={searchValue}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên nhân viên"
          value={employeeName}
          onChangeText={setEmployeeName}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={employeeUsername}
          onChangeText={setEmployeeUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={employeePassword}
          onChangeText={setEmployeePassword}
          secureTextEntry={true}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Loại tài khoản:</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              employeeType === 0 && styles.radioButtonSelected,
            ]}
            onPress={() => setEmployeeType(0)}>
            <Text
              style={[
                styles.radioButtonLabel,
                employeeType !== 0 && styles.unselectedLabel, // Kiểm tra nút không chọn
              ]}>
              Quản lý
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              employeeType === 1 && styles.radioButtonSelected,
            ]}
            onPress={() => setEmployeeType(1)}>
            <Text
              style={[
                styles.radioButtonLabel,
                employeeType !== 1 && styles.unselectedLabel, // Kiểm tra nút không chọn
              ]}>
              Nhân viên
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedEmployee ? (
        <TouchableOpacity style={styles.updateButton} onPress={editEmployee}>
          <Text style={styles.buttonText}>Cập nhật</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={addEmployee}>
          <Text style={styles.buttonText}>Thêm nhân viên</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>Danh sách nhân viên:</Text>

      <View style={styles.employeeList}>{renderEmployeeList()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  employeeList: {
    flex: 1,
  },
  employeeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeType: {
    fontSize: 16,
    color: 'gray',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 30,
  },
  searchInput: {
    height: 30,
    borderRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  radioButtonLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  unselectedLabel: {
    color: 'gray',
  },
  securityCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  securityCodeText: {
    fontSize: 14,
    marginRight: 10,
  },
  securityCodeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
