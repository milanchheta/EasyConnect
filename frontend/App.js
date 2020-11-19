import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { store, persistor } from "./store.js";
import { PersistGate } from "redux-persist/integration/react";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import PaperList from "./components/PaperList";
import PaperDetails from "./components/PaperDetails";
import Requests from "./components/Requests";
import Messages from "./components/Messages";
import Connections from "./components/Connections";
import MessageRoom from "./components/MessageRoom";
import UserProfile from "./components/UserProfile.js";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerLeft: null }}
            />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen
              name="Home"
              options={{ headerLeft: null }}
              component={Home}
            />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="PaperList" component={PaperList} />
            <Stack.Screen name="PaperDetails" component={PaperDetails} />
            <Stack.Screen name="Requests" component={Requests} />
            <Stack.Screen name="Messages" component={Messages} />
            <Stack.Screen name="Connections" component={Connections} />
            <Stack.Screen name="MessageRoom" component={MessageRoom} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
