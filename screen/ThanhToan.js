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

import { format } from 'date-fns';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
export default function ThanhToan({ route }) {
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
      tong += parseInt(chiTietMonAn[i].price);
      console.log(chiTietMonAn);

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
      console.log(id)
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
  const ThanhToan = async () => {
    if (chiTietMonAn.length < 1) {
      alert('Không có món để thanh toán');
    } else {
      let now = new Date();
      let nowString = moment(now).format('hh:mm DD/MM/YYYY');
      try {
        let response = await fetch(
`https://647afa13d2e5b6101db0b2c3.mockapi.io/table/${banGoi[0].id}`,
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json;harset=UTF-8',
              'authorization':'Basic ZHBhbG1hQGljZy5jb20uZ3Q6Z3VhdGU1MDI==',
              'Content-Type': 'application/json;harset=UTF-8',
            },
            body: JSON.stringify({ id_bill:''}),
          }
        );
        if (response.ok) {
          // Cập nhật thành công
          const update = {
            time : nowString,
            id_staff : 2
          }
          try {
            let response1 = await fetch(
              `https://647b0c0ed2e5b6101db0c690.mockapi.io/bill/${id}`,
              {
                method: 'PUT',
                headers: {
                  'authorization':'Basic ZHBhbG1hQGljZy5jb20uZ3Q6Z3VhdGU1MDI==',
                  'Content-Type': 'application/json;harset=UTF-8',
                },
                body: JSON.stringify(update),
              }
            );
            response = await response.json();
            if (response1.ok) {
              // Cập nhật thành công
              alert('Thành công');
              navigation.navigate('HomeScreen_0');
            } else {
              // Xử lý lỗi khi cập nhật không thành công
              console.error('Lỗi khi cập nhật bill 123:', response.status);
            }
          } catch (error) {
            console.error('Lỗi khi cập nhật bàn:', error);
          }
        } else {
          // Xử lý lỗi khi cập nhật không thành công
          console.error('Lỗi khi cập nhật bàn 123:', response.status);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật bàn:', error);
      }
      //END CẬP NHẬT THANH TOÁN
      ban = new Ban(id + 1, nowString);
      for (var i = 0; i < ql.getTongSoMonTrongBan(id); i++) {
        ban.addMon(ql.getMonAn(id, i), ql.getSoLuongMon(id, i));
      }
      bill.addBill(ban);
      ql.removeDoAn(id);
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
        <Text style={styles.chuThanhToan}>THANH TOÁN</Text>
      </View>
      <View style={styles.chuThichTieuDe}>
<Text>DANH SÁCH CÁC MÓN CẦN THANH TOÁN</Text>
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
            <Text style={styles.gia}>{chiTietMonAn[index].price} $</Text>
            <Text style={styles.soLuong}>{item.quantity}</Text>
          </View>
        )}
      />
      <View style={styles.phuongThucTT}>
        <View style={styles.cumTongBill}>
          <Text style={styles.chuTongBill}>TỔNG BILL:</Text>
          <Text style={styles.soTongBill}>{tongBill} $</Text>
        </View>
        <View style={styles.chuPhuongThuc}>
          <Text style={styles}>PHƯƠNG THỨC THANH TOÁN:</Text>
        </View>
        <View style={styles.cacPT}>
          <Text style={styles.ptThanhToan}>TIỀN MẶT</Text>
          <Text style={styles.ptThanhToan} onPress={() => letToggle()}>
            MOMO
          </Text>
        </View>
        <View style={styles.cumXuatBill}>
          <TouchableOpacity
            onPress={() => ThanhToan()}
            style={styles.thanhToan}>
            <Text style={styles.xuatBill}>THANH TOÁN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  cumXuatBill: {
    flexDirection: 'row',
  },
  momo: {
    position: 'absolute',
    right: 40,
    top: 60,
    zIndex: 999,
  },
  thanhToan: {
    marginBottom: 20,
    marginLeft: 75,
    width: 100,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 5,
  },
  cacPT: {
    marginBottom: 50,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ptThanhToan: {
    width: 200,
    backgroundColor: '#00FCFC',
    borderRadius: 30,
    marginLeft: 10,
    padding: 5,
  },
  chuPhuongThuc: {
    marginLeft: 20,
  },
  thanhToanImage: {
    width: 80,
    height: 80,
  },
  phuongThucTT: {
    paddingTop: 10,
    backgroundColor: 'white',
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
  cumTongBill: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
  },
  chuTongBill: {
    backgroundColor: 'pink',
    borderRadius: 30,
  },
  soTongBill: {
    width: 100,
    borderRadius: 30,
    marginLeft: 10,
    paddingLeft: 10,
    backgroundColor: '#00FCFC',
    alignContent: 'center',
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
  },
});