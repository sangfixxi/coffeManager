import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
export default function ChiTietHoaDon({ route }) {
  const navigation = useNavigation();
  const id = route.params.id;
  const [banGoi, setBanGoi] = useState([]);
  const [monAn, setTableMon] = useState([]);
  const [chiTietMonAn, setChiTietTableMon] = useState([]);
  const [sieuMon, setSieuMon] = useState([]);
  const [tongBill, setTongBill] = useState();
  useEffect(() => {
    fetchTable();
    layDuLieuPhong();
  }, []);

  useEffect(() => {
    fetchMonAn();
  }, [monAn]);
  useEffect(() => {
    tinhTong();
  }, [chiTietMonAn]);

  //Lấy danh sách tên giá các món ăn
  const tinhTong = async () => {
    var tong = 0;
    for (var i = 0; i < chiTietMonAn.length; i++) {
      tong += chiTietMonAn[i].price * monAn[i].quantity;
      
    }
    setTongBill(tong);
  };
  const layDuLieuPhong = async () => {
    try {
      const response2 = await fetch(
        `https://647afa13d2e5b6101db0b2c3.mockapi.io/table?id_bill=${id}`
      );
      const data1 = await response2.json();
      setBanGoi(data1);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }

    setSieuMon([...monAn, ...chiTietMonAn]);
  };
  const fetchMonAn = async () => {
    for (var i = 0; i < monAn.length; i++) {
      try {
        const response2 = await fetch(
          `https://647afa13d2e5b6101db0b2c3.mockapi.io/product/?id=${monAn[i].id_product}`
        );
        const data1 = await response2.json();
        setChiTietTableMon((chiTietMonAn) => [...chiTietMonAn, ...data1]);
      } catch (error) {
        console.error('Lỗi khi tìm nạp danh sách bàn:', error);
      }
    }
    setSieuMon([...monAn, ...chiTietMonAn]);
  };
  // Lấy danh các món ở trong bàn
  const fetchTable = async () => {
    try {
      const response = await fetch(
        `https://647b0c0ed2e5b6101db0c690.mockapi.io/detai_bill/?id_bill=${id}`
      );

      const data = await response.json();
      setTableMon(data);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }
  };
  const imageQR = require('../assets/qr.png');
  const [show_Hide, setShowHide] = useState('none');
  const letToggle = () => {
    if (show_Hide === 'flex') {
      setShowHide('none');
    } else {
      setShowHide('flex');
    }
  };
  const imageBack = require('../assets/coffee-bg.jpg');
  return (
    <ImageBackground source={imageBack} resizeMode="cover" style={styles.image}>
      <Image
        source={imageQR}
        style={[
          styles.momo,
          {
            width: 300,
            height: 250,
resizeMode: 'contain',
            display: show_Hide,
          },

        ]}
        onPress={() => letToggle()}
      />
      <View style={styles.trumTenBan}>
        <TouchableOpacity onPress={() => navigation.navigate('ThongTinBan')}>
          <Image
            style={styles.turnBack}
            source={require('../assets/quayLai.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cumThanhToan}>
        <Image
          style={styles.thanhToanImage}
          source={require('../assets/ThanhToan.png')}
        />
        <Text style={styles.chuThanhToan}>CHI TIẾT HÓA ĐƠN {id}</Text>
      </View>
      <View style={styles.chuThichTieuDe}>
        <Text>DANH SÁCH CÁC MÓN TRONG HÓA ĐƠN</Text>
      </View>
      <View style={styles.chuThich}>
        <Text style={styles.doUong}>ĐỒ UỐNG</Text>
        <Text style={styles.gia}>GIÁ</Text>
        <Text style={styles.soLuong}>SL</Text>
      </View>
      <FlatList
        data={sieuMon}
        renderItem={({ item, index }) => (
          <View style={styles.thongTinDoUong}>
            <Text style={styles.doUong}>{chiTietMonAn[index].name}</Text>
            <Text style={styles.gia}>{chiTietMonAn[index].price} Đ</Text>
            <Text style={styles.soLuong}>{item.quantity}</Text>
          </View>
        )}
      />
      <View style={styles.chuThich}>
        <Text style={styles.doUong}>TỔNG TIỀN:</Text>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({

  thanhToanImage: {
    width: 80,
    height: 80,
  },
  turnBack: {
    width: 30,
    height: 30,
  },
  trumTenBan: {
    alignContent: 'center',
    marginTop: 40,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  image: {
    flex: 1,
  },
  thongTinDoUong: {
    flexDirection: 'row',
    backgroundColor: '#8CFF79',
    borderRadius: 30,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  chuThich: {
    flexDirection: 'row',
    backgroundColor: '#00FFFF',
    borderRadius: 30,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  doUong: {
    margin: 20,
    position: 'absolute',
    left: 20,
  },
  gia: {
    margin: 20,
    position: 'relative',
    left: 200,
  },
  soLuong: {
    margin: 20,
    position: 'absolute',
    right: 10,
  },
  chuThichTieuDe: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  cumThanhToan: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    opacity: 0.5,
  },
  chuThanhToan: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: '600',
  }


});