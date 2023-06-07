import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import Constants from 'expo-constants';

export default function App() {
  const [id, changeID] = useState('');
  const [name, changeName] = useState('');
  const [price, changePrice] = useState('');
  const [tableList, setTableList] = useState([]);

  useEffect(() => {
    fetchTable();
  }, []);

  const Click = (item) => {
    changeID(item.id);
    changeName(item.name);
    changePrice(item.price);
  };

  const fetchTable = async () => {
    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/product'
      );
      const data = await response.json();
      setTableList(data);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách đồ uống:', error);
    }
  };

  const addTable = async () => {
    const newTable = {
      name: name,
      price: price,
    };

    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/product',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTable),
        }
      );

      if (response.ok) {
        const createdTable = await response.json();
        setTableList([...tableList, createdTable]);
        changeID('');
        changeName('');
        changePrice('');
        fetchTable();
      } else {
        console.error('Lỗi khi thêm đồ uống:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi thêm đồ uống:', error);
    }
  };

  const updateTable = async () => {
    if (name !== '' && price !== '') {
      const updatedTable = {
        name: name,
        price: price,
      };

      try {
        const response = await fetch(
          `https://647afa13d2e5b6101db0b2c3.mockapi.io/product/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTable),
          }
        );

        if (response.ok) {
          const updatedTableList = tableList.map((table) => {
            if (table.id === parseInt(id)) {
              return {
                id: table.id,
                name: name,
                price: price,
              };
            }
            return table;
          });
          setTableList(updatedTableList);
          changeID('');
          changeName('');
          changePrice('');
          fetchTable();
        } else {
          console.error('Lỗi khi cập nhật đồ uống:', response.status);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật đồ uống:', error);
      }
    } else {
      console.error('Vui lòng nhập tên đồ uống và giá.');
    }
  };

  const deleteTable = async () => {
    try {
      const response = await fetch(
        `https://647afa13d2e5b6101db0b2c3.mockapi.io/product/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        await fetchTable();
        changeID('');
        changeName('');
        changePrice('');
        fetchTable();
        console.log('Đồ uống đã được xóa thành công.');
      } else {
        console.error('Lỗi khi xóa đồ uống:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi xóa đồ uống:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/coffee-bg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../assets/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Quản Lý Đồ Uống</Text>
        </View>
        <Text style={styles.sectionTitle}>Danh sách đồ uống</Text>
        <FlatList
          style={styles.tableList}
          data={tableList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tableItem,
                id === item.id ? styles.selectedTableItem : null,
              ]}
              onPress={() => Click(item)}
            >
              <Text style={styles.tableItemText}>{item.name}</Text>
              <Text style={styles.tableItemText}>{item.price}$</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Tên đồ uống"
            onChangeText={changeName}
            value={name}
          />
          <TextInput
            style={styles.input}
            placeholder="Giá"
            onChangeText={changePrice}
            value={price}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={addTable}
            >
              <Text style={styles.buttonText}>Thêm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={updateTable}
            >
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={deleteTable}
            >
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableList: {
    flex: 1,
    marginBottom: 16,
  },
  tableItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTableItem: {
    backgroundColor: '#8ED1C6',
  },
  tableItemText: {
    fontSize: 16,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  input: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    borderColor: '#8ED1C6',
    borderWidth: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#8ED1C6',
  },
  updateButton: {
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
