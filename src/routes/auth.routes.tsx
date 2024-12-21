//Página que apenas usuários não logados podem acessar

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../pages/SignIn";

const stack = createNativeStackNavigator();

function AuthRoutes() {
  return (
    <stack.Navigator>
      <stack.Screen name="SignIn" component={SignIn} options={{headerShown: false}} />
    </stack.Navigator>
  );
}

export default AuthRoutes;