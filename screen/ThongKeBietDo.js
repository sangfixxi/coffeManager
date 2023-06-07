import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const data = [
  { label: 'Tháng 1', value: '1' },
  { label: 'Tháng 2', value: '2' },
  { label: 'Tháng 3', value: '3' },
  { label: 'Tháng 4', value: '4' },
  { label: 'Tháng 5', value: '5' },
  { label: 'Tháng 6', value: '6' },
  { label: 'Tháng 7', value: '7' },
  { label: 'Tháng 8', value: '8' },
  { label: 'Tháng 9', value: '9' },
  { label: 'Tháng 10', value: '10' },
  { label: 'Tháng 11', value: '11' },
  { label: 'Tháng 12', value: '12' },
];
const dataNam = [
  { label: '2022', value: '2022' },
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
  { label: '2028', value: '2029' },
  { label: '2030', value: '2030' },
];

const DropdownComponent = () => {
  const load = async () => {
   useEffect(() => {
    layDuLieuHoaDon();
  }, []);
  
  }
   useEffect(() => {
    layDuLieuHoaDon();
  }, []);
    const [data, setData] = useState([]);
  const [value, setValue] = useState(null);
  const [nam, setNam] = useState(2023);
  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  const layDuLieuHoaDon = async () => {
    const dataThang = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    try {
      const response2 = await fetch(
        `https://647b0c0ed2e5b6101db0c690.mockapi.io/bill`
      );
      const data1 = await response2.json();
      const data2 = [];
      for (var i = data1.length - 1; i >= 0; i--) {
        if (data1[i].time != '') {
          var date = new Date(data1[i].time).getFullYear();
          if (date == nam) {
            data2.push(data1[i]);
          }
        }
      }
        for (var j = 0; j < data2.length; j++) {
          try {
            const response3 = await fetch(
              `https://647b0c0ed2e5b6101db0c690.mockapi.io/detai_bill/?id_bill=${data2[j].id}`
            );
            const dataBill = await response3.json();

            var tong = 0;
            for (var g = 0; g < dataBill.length; g++) {
              try {
                const response4 = await fetch(
                  `https://647afa13d2e5b6101db0b2c3.mockapi.io/product?id=${data2[j].id}`
                );
                const dataBillChiTiet = await response4.json();
                tong += dataBillChiTiet[0].price * dataBill[g].quantity

              } catch (error) {
                console.error('Lỗi detail:', error);
              }
            }
            var date2 = new Date(data2[j].time).getDate()-1;
            dataThang[date2] += tong
            /*for (var z = 0; z < dataBill.length; z++) {
              var date2 = new Date(data2[i].time).getMonth() + 1;
              if (date2 == o + 1) {

              }
            }*/
          } catch (error) {
            console.error('Lỗi detail:', error);
          }
        }
        setData(dataThang)
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }
  };
  return (
    <View>
      <View style={styles.chonNgay}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dataNam}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Chọn năm"
          value={nam}
          value="2023"
          onChange={(item) => {
            setNam(item.value);
            layDuLieuHoaDon();
            setNam(item.value);
          }}
          renderItem={renderItem}
        />
      </View>
      <View>
        <Text>Thống kê năm {nam}</Text>
        <LineChart
          data={{
            labels: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
            ],
            datasets: [
              {
                data: data,
              },
            ],
          }}
          width={Dimensions.get('window').width} // from react-native
          height={500}
          yAxisLabel="Đ "
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    width: 120,
    elevation: 2,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  chonNgay: {
    flexDirection: 'row',
  },
});
