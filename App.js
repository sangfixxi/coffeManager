import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screen/LoginScreen';
import ForgotPasswordScreen from './screen/ForgotPasswordScreen';
import ResetPasswordScreen from './screen/ResetPasswordScreen';
import FinishResetPasswordScreen from './screen/FinishResetPasswordScreen';
import HomeScreen_0 from './screen/HomeScreen_0';
import HomeScreen_1 from './screen/HomeScreen_1';
import EmployeeManager from './screen/EmployeeManager';
import Order from './screen/Order';
import ManageTable from './screen/ManageTable';
import ProductManager from './screen/ProductManager';
import ChiTietHoaDon from './screen/ChiTietBill';
import QuanLyHoaDon from './screen/QuanLyHoaDon';
import ThanhToan from './screen/ThanhToan';
import ThongKeBieuDo from './screen/ThongKeBietDo';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        <Stack.Screen name="FinishResetPasswordScreen" component={FinishResetPasswordScreen} />
        <Stack.Screen name="HomeScreen_0" component={HomeScreen_0} />
        <Stack.Screen name="HomeScreen_1" component={HomeScreen_1} />
        <Stack.Screen name="EmployeeManager" component={EmployeeManager} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="ManageTable" component={ManageTable} />
        <Stack.Screen name="ProductManager" component={ProductManager} />
        <Stack.Screen name="ChiTietHoaDon" component={ChiTietHoaDon} />
        <Stack.Screen name="QuanLyHoaDon" component={QuanLyHoaDon} />
        <Stack.Screen name="ThanhToan" component={ThanhToan} />
        <Stack.Screen name="ThongKeBieuDo" component={ThongKeBieuDo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
