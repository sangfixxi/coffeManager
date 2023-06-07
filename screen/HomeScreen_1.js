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

import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [tables, setTables] = useState([]); // State lưu trữ danh sách bàn
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
      <View style={styles.table}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Order', {
              tableId: item.id,
              billId: item.id_bill,
            }); // Điều hướng đến màn hình 'order' và truyền id bàn qua tham số
          }}>
          <View style={styles.tableContent}>
            <Image
              style={styles.img}
              source={require('../assets/table.jpg')} // Hiển thị ảnh bàn
            />
            <Text style={styles.tableName}>{item.name}</Text>
            <Text style={styles.tableName}>Trạng thái: </Text>
            {item.id_bill === '' ? (
              <View style={styles.greenBox} />
            ) : (
              <View style={styles.redBox} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleLogout = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <ImageBackground
      source={require('../assets/coffee-bg.jpg')}
      style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../assets/logo.jpg')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Tìm kiếm..." />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Tìm</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.tableList}
        data={tables}
        renderItem={showTable}
        keyExtractor={(item) => item.id.toString()}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
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
  logoutButton: {
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  tableList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  table: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 8,
    borderColor: '#8ED1C6',
    borderWidth: 2,
    padding: 8,
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
    marginRight: 16,
  },
  tableName: {
    fontSize: 20,
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
