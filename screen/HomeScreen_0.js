import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [tables, setTables] = useState([]); // State lưu trữ danh sách bàn
  const [selectedOption, setSelectedOption] = useState(''); // State lưu trữ tùy chọn được chọn
  const navigation = useNavigation(); // Sử dụng hook useNavigation để điều hướng màn hình

  useEffect(() => {
    const reload = navigation.addListener('focus', () => {
      fetchTable();
    }); // Gọi hàm fetchTable() khi component được tạo
    return reload;
  }, [navigation]);

  const fetchTable = async () => {
    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/table'
      );
      const data = await response.json();
      setTables(data); // Cập nhật danh sách bàn vào state
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }
  };

  const showTable = ({ item }) => {
    return (
      <View style={tableStyles.table}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Order', {
              tableId: item.id,
              billId: item.id_bill,
            }); // Điều hướng đến màn hình 'oder' và truyền id bàn qua tham số
          }}>
          <View style={tableStyles.tableContent}>
            <Image
              style={tableStyles.img}
              source={require('../assets/table.jpg')} // Hiển thị ảnh bàn
            />
            <Text style={tableStyles.tableName}>{item.name}</Text>
            <Text style={tableStyles.tableName}>Trạng thái: </Text>
            {item.id_bill === '' ? (
              <View style={tableStyles.greenBox} />
            ) : (
              <View style={tableStyles.redBox} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

const handlePickerChange = (itemValue) => {
  setSelectedOption(itemValue); // Cập nhật giá trị được chọn
  switch (itemValue) {
    case 'dangxuat':
      navigation.navigate('LoginScreen');
      break;
    case 'themSP':
      navigation.navigate('ProductManager');
      break;
    case 'themNV':
      navigation.navigate('EmployeeManager');
      break;
    case 'themban':
      navigation.navigate('ManageTable');
      break;
    case 'qldon':
      navigation.navigate('QuanLyHoaDon');
      break;
    case 'bd':
      navigation.navigate('ThongKeBieuDo');
      break;
  }
};

  useEffect(() => {
  }, []);

  const options = [
    { label: 'Đăng Xuất', value: 'dangxuat' },
    { label: 'Quản Lý Sản Phẩm', value: 'themSP' },
    { label: 'Quản Lý Nhân Viên', value: 'themNV' },
    { label: 'Quản Lý Bàn', value: 'themban' },
    { label: 'Quản Lý đơn', value: 'qldon' },
    { label: 'Biểu đồ', value: 'bd' },
  ];

  return (
    <ImageBackground
      source={require('../assets/coffee-bg.jpg')}
      style={headerStyles.backgroundImage}>
      <View>
        <View style={headerStyles.container}>
          <TouchableOpacity style={headerStyles.backButton}>
            <Image
              source={require('../assets/logo.jpg')}
              style={headerStyles.backIcon}
            />
          </TouchableOpacity>
          <View style={headerStyles.searchContainer}>
            <TextInput
              style={headerStyles.searchInput}
              placeholder="Tìm kiếm..."
            />
            <TouchableOpacity style={headerStyles.searchButton}>
              <Text style={headerStyles.searchButtonText}>Tìm</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Picker
              selectedValue={selectedOption}
              style={headerStyles.dropdown}
              onValueChange={(itemValue) => handlePickerChange(itemValue)}
              prompt="Tùy Chọn">
              {options.map((option) => (
                <Picker.Item
                  label={option.label}
                  value={option.value}
                  key={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <FlatList
          style={tableStyles.container}
          data={tables}
          renderItem={showTable}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ImageBackground>
  );
}

const tableStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: Dimensions.get('window').height * 0.8,
  },
  table: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
    borderColor: '#8ED1C6',
    borderWidth: 2,
    padding: 5,
    backgroundColor: '#F4FAF8',
  },
  tableContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  tableName: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
    color: '#348C7F',
  },
  greenBox: {
    width: 50,
    height: 20,
    backgroundColor: '#228B22',
    marginLeft: 30,
  },
  redBox: {
    width: 50,
    height: 20,
    backgroundColor: '#FF0000',
    marginLeft: 30,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8ED1C6',
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#8ED1C6',
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  dropdown: {
    height: 40,
    width: 50,
    backgroundColor: '#8ED1C6',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: 'black',
    fontSize: 16,
    padding: 15,
    marginLeft: 5,
  },
});
