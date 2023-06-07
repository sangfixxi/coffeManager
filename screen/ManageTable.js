import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Constants from 'expo-constants';

export default function App() {
  const [tableId, setTableId] = useState('');
  const [tableName, setTableName] = useState('');
  const [tableCondition, setTableCondition] = useState('on');
  const [tableList, setTableList] = useState([]);

  useEffect(() => {
    fetchTable();
  }, []);

  // Lấy danh sách bàn từ API
  const fetchTable = async () => {
    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/table'
      );
      const data = await response.json();
      setTableList(data);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }
  };

  // Thêm bàn mới
  const addTable = async () => {
    const newTable = {
      id_bill: '',
      name: 'Bàn ' + (tableList.length + 1),
    };

    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/table',
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
        setTableId('');
        setTableName('');
      } else {
        console.error('Lỗi khi thêm bàn:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi thêm bàn:', error);
    }
  };

  // Xử lý cập nhật thông tin bàn
  const updateTable = async () => {
    if (tableName !== '' && tableCondition !== '') {
      const updatedTable = {
        name: tableName,
        condition: tableCondition,
      };

      try {
        const response = await fetch(
          `https://647afa13d2e5b6101db0b2c3.mockapi.io/table/${tableId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTable),
          }
        );

        if (response.ok) {
          // Cập nhật thành công
          const updatedTableList = tableList.map((table) => {
            if (table.id === parseInt(tableId)) {
              return {
                id: table.id,
                name: tableName,
                condition: tableCondition,
              };
            }
            fetchTable();
            return table;
          });
          setTableList(updatedTableList);
          setTableId('');
          setTableName('');
          setTableCondition('');
          // Reload lại trang
        } else {
          // Xử lý lỗi khi cập nhật không thành công
          console.error('Lỗi khi cập nhật bàn:', response.status);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật bàn:', error);
      }
    } else {
      console.error('Vui lòng nhập tên bàn và tình trạng bàn.');
    }
  };

  // Xử lý xóa bàn
  const deleteTable = async () => {
    try {
      const response = await fetch(
        `https://647afa13d2e5b6101db0b2c3.mockapi.io/table/${tableId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        await fetchTable();
        setTableId('');
        setTableName('');
        setTableCondition('');
        console.log('Bàn đã được xóa thành công.');
        // Reload lại trang
      } else {
        console.error('Lỗi khi xóa bàn:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi xóa bàn:', error);
    }
  };

  // Xử lý chỉnh sửa bàn
  const handleEdit = (table) => {
    setTableId(table.id.toString());
    setTableName(table.name);
    setTableCondition(table.condition);
  };

  return (
    <ImageBackground
      source={require('../assets/coffee-bg.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>QUẢN LÝ BÀN</Text>

        <View style={styles.formContainer}>

          <Text style={styles.label}>Tên bàn:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setTableName(text)}
            value={tableName}
            placeholder="Nhập tên bàn"
          />

          <Text style={styles.label}>Tình trạng:</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'blue' }]}
              onPress={addTable}>
              <Text style={styles.buttonText}>THÊM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'green' }]}
              onPress={updateTable}>
              <Text style={styles.buttonText}>SỬA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'red' }]}
              onPress={deleteTable}>
              <Text style={styles.buttonText}>XÓA</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableList}>
          <Text style={styles.tableListTitle}>Danh sách bàn:</Text>
          <FlatList
            data={tableList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.tableItemContainer}
                onPress={() => handleEdit(item)}>
                <Text style={styles.tableItemText}>{item.name}</Text>
                <Text style={styles.tableItemText}>
                  Trạng thái: {item.condition}
                </Text>
                {item.id_bill === '' ? (
                  <View style={styles.greenBox} />
                ) : (
                  <View style={styles.redBox} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 3,
    borderColor: 'steelblue',
    padding: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 8,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableList: {
    flex: 1,
  },
  tableListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderWidth: 3,
    margin: 2,
    borderRadius: 10,
    borderColor: 'gold',
  },
  tableItemText: {
    fontSize: 16,
    margin: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
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
