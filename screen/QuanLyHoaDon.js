import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Platform,
  Pressable
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState,useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
export default function HoaDon({ route }) {
  const navigation = useNavigation();
  const imageBack = require('../assets/coffee-bg.jpg');
  const [bill, setBill] = useState([]);
    useEffect(() => {
    layDuLieuHoaDon()
  }, []);
  const layDuLieuHoaDon = async () => {
    try {
      const response2 = await fetch(
        `https://647b0c0ed2e5b6101db0c690.mockapi.io/bill`
      );
      const data1 = await response2.json();
      const data2 = []
      for (var i = data1.length-1; i >=0; i--) {
          if(data1[i].time!="")
          {
              data2.push(data1[i])
          }
    }
    setBill(data2);
      
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }
  };
  return (
    <ImageBackground source={imageBack} resizeMode="cover" style={styles.image}>
      <View style={styles.trumTenBan}>
        <TouchableOpacity onPress={() => navigation.replace('Home')}>
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
        <Text style={styles.chuThanhToan}>Quản lý hóa đơn</Text>
      </View>
      <View style={styles.chuThichTieuDe}>
        <Text>DANH SÁCH CÁC BILL</Text>  
      </View>
      <View style={styles.chuThich}>
        <Text style={styles.doUong}>STT</Text>
        <Text style={styles.gia}>Thời gian</Text>
      </View>
      <FlatList
        data={bill}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.replace('ChiTietHoaDon',{"id":item.id})}>
          <View style={styles.thongTinDoUong}>
            <Text style={styles.doUong}>{item.id}</Text>
            <Text style={styles.gia}>{item.time}</Text>
          </View>
          </TouchableOpacity>
        )}
      />
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
    left: 1,
  },
  gia: {
    margin: 20,
    position: 'relative',
    left: 40,
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
  },
});
