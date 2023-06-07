import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Oder({ route }) {
  const navigation = useNavigation();

  const tableId= route.params.tableId;
  const bill_Id=route.params.billId;
  console.log(bill_Id);

  useEffect(() => {
    fetchProducts(); // Gọi hàm fetchProducts thay vì fetchProduct
    console.log(bill_Id);
  }, []);

  const [products, setProducts] = useState([]); // Sử dụng tên products thay vì product
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBrandFilters, setShowBrandFilters] = useState(false);
  const [billList, setBillList] = useState([]); // Thêm khai báo biến setBillList

  const calculateTotal = () => {
    let total = 0;
    selectedItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const addItemToCart = (item) => {
    const existingItem = selectedItems.find(
      (selectedItem) => selectedItem.id === item.id
    );

    if (existingItem) {
      const updatedItems = selectedItems.map((selectedItem) => {
        if (selectedItem.id === item.id) {
          return { ...selectedItem, quantity: selectedItem.quantity + 1 };
        }
        return selectedItem;
      });
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const removeItemFromCart = (item) => {
    const existingItem = selectedItems.find(
      (selectedItem) => selectedItem.id === item.id
    );

    if (existingItem.quantity === 1) {
      const updatedItems = selectedItems.filter(
        (selectedItem) => selectedItem.id !== item.id
      );
      setSelectedItems(updatedItems);
    } else {
      const updatedItems = selectedItems.map((selectedItem) => {
        if (selectedItem.id === item.id) {
          return { ...selectedItem, quantity: selectedItem.quantity - 1 };
        }
        return selectedItem;
      });
      setSelectedItems(updatedItems);
    }
  };

  // Lấy dữ liệu sản phẩm từ mock API
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/product'
      );
      const data = await response.json();
      setProducts(data); // Cập nhật danh sách sản phẩm vào state
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
    }
  };

  const addOrUpdateBill = async () => {
    try {
      // Kiểm tra xem bàn đã có bill hay chưa
      const response = await fetch(
        `https://647b0c0ed2e5b6101db0c690.mockapi.io/bill/${tableId}`
      );
      if (response.ok) {
        const bills = await response.json();
        console.log(bills[0]);
        if (bills.length > 0) {
          await createDetailBills(selectedItems, bills[0].id);
            console.log('thêrm bill thành công' + 'sua');

        } else {
          // Bàn chưa có bill, thực hiện thêm bill mới
          const newBill = {
            id_table: tableId,
            id_staff: '', // Giá trị id_staff mới
            time: '', // Giá trị thời gian mới
            // Thêm các trường khác vào bill mới
          };

          const addResponse = await fetch(
            'https://647b0c0ed2e5b6101db0c690.mockapi.io/bill',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newBill),
            }
          );

          if (addResponse.ok) {
            const createdBill = await addResponse.json();
            setBillList([...billList, createdBill]);

            // Cập nhật trường id_bill trong table
            await updateTableIdBill(tableId, createdBill.id);
            console.log('thêrm bill thành công' + 'them');
            idBill = createdBill.id;
            await createDetailBills(selectedItems, createdBill.id);
          } else {
            console.error('Lỗi khi thêm bill:', addResponse.status);
          }
        }
      } else {
        console.error('Lỗi khi kiểm tra bill:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi thêm hoặc cập nhật bill:', error);
    }
  };

  const updateTableIdBill = async (tableId, billId) => {
    try {
      const updatedTable = {
        id_bill: billId,
      };

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
        console.log('Cập nhật trường id_bill thành công');
      } else {
        console.error('Lỗi khi cập nhật id_bill:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật id_bill:', error);
    }
  };

  const createDetailBills = async (selectedItems, idBill) => {
    try {
      for (const item of selectedItems) {
        const detailBill = {
          id_bill: idBill,
          id_product: item.id,
          quantity: item.quantity,
        };

        const response = await fetch(
          'https://647b0c0ed2e5b6101db0c690.mockapi.io/detai_bill',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(detailBill),
          }
        );

        if (response.ok) {
          const createdDetailBill = await response.json();
          console.log('Đã tạo chi tiết hóa đơn:', createdDetailBill);
        } else {
          console.error('Lỗi khi tạo chi tiết hóa đơn:', response.status);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tạo chi tiết hóa đơn:', error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => addItemToCart(item)}>
        <View style={styles.itemContainer}>
          <Image
            style={styles.itemImage}
            source={require('../assets/cafe.jpg')}
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price} $</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleFilterByBrand = () => {
    setShowBrandFilters(!showBrandFilters);
  };

  const renderBrandFilters = () => {
    if (showBrandFilters) {
      return (
        <View style={styles.brandFilterContainer}>
          <TouchableOpacity style={styles.brandFilterButton}>
            <Text style={styles.brandFilterButtonText}>Cafe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.brandFilterButton}>
            <Text style={styles.brandFilterButtonText}>Tea</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.brandFilterButton}>
            <Text style={styles.brandFilterButtonText}>Cake</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
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
      </View>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={handleFilterByBrand}>
        <Text style={styles.filterButtonText}>Lọc Theo Brand</Text>
      </TouchableOpacity>
      {renderBrandFilters()}

      <FlatList
        data={products} // Sử dụng danh sách sản phẩm từ state "products"
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.cartContainer}>
        <Text style={styles.cartTitle}>Danh sách đã chọn:</Text>
        <ScrollView>
          {selectedItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <View style={styles.cartItemQuantity}>
                <TouchableOpacity onPress={() => removeItemFromCart(item)}>
                  <Text style={styles.cartItemQuantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.cartItemQuantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => addItemToCart(item)}>
                  <Text style={styles.cartItemQuantityText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <Text style={styles.cartTotal}>Tổng cộng: {calculateTotal()} đ</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addOrUpdateBill()}>
          <Text style={styles.buttonText}>ĐẶT MÓN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('ThanhToan', { id: bill_Id });
          }}>
          <Text style={styles.buttonText}>THANH TOÁN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#e8f4f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9eaf2',
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 16,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#a8c6d8',
    borderRadius: 4,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#ffffff',
  },
  filterButton: {
    backgroundColor: '#4ca9d8',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  brandFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  brandFilterButton: {
    backgroundColor: '#4ca9d8',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  brandFilterButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d9eaf2',
  },
  itemImage: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    flex: 1,
    color: '#000000',
  },
  itemPrice: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#000000',
  },
  cartContainer: {
    marginBottom: 20,
    height: 150,
    marginTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#d9eaf2',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cartItemName: {
    flex: 1,
    color: '#000000',
  },
  cartItemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  cartItemQuantityText: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#000000',
  },
});
