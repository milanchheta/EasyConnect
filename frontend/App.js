import * as React from "react";
import "react-native-gesture-handler";

/**
 * Import statements for react navigation.
 */
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerView,
  DrawerItemList,
} from "@react-navigation/drawer";

/**
 * Import statements for supporting react elements.
 */
import { PersistGate } from "redux-persist/integration/react";
import { Icon } from "react-native-elements";
import { Button } from "react-native";

/**
 * Import statements for secondary components.
 */
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
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";

/**
 * Import statements for redux store, provider.
 */
import { Provider } from "react-redux";
import { store, persistor } from "./store.js";
import { logout } from "./Actions/LoginAction.js";

/**
 * Navigation objects for both stack and drawer navigation.
 */
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * App starting point. All navigation routes are defined in this component.
 */
export default function App() {
  /**
   * Function to return the stack header for the home page.
   */
  function homeStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#7A1705",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Icon
                name="menu"
                type="material"
                size={40}
                style={{ marginLeft: 10 }}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            ),
          })}
        />
      </Stack.Navigator>
    );
  }

  /**
   * Function to return the stack header for the requests page.
   */
  function requestStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#7A1705",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Requests"
          component={Requests}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Icon
                name="menu"
                type="material"
                size={40}
                style={{ marginLeft: 10 }}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            ),
          })}
        />
      </Stack.Navigator>
    );
  }

  /**
   * Function to return the stack header component for the profile page.
   */
  function profileStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#7A1705",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Profile"
          component={UserProfile}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Icon
                name="menu"
                type="material"
                size={40}
                style={{ marginLeft: 10 }}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            ),
          })}
        />
      </Stack.Navigator>
    );
  }

  /**
   * Http get request to get the connections for the user.
   */
  const getConnectionList = () => {
    axios
      .get("http://10.0.2.2:5000/connect", {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        let data = response.data;
        navigation.navigate("Connections", { data });
      })
      .catch((err) => {
        console.log("Error fetching data");
      });
  };

  /**
   * Function to return the stack header for the message screen.
   */
  function messageStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#7A1705",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Messages"
          component={Messages}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Icon
                name="menu"
                type="material"
                size={40}
                style={{ marginLeft: 10 }}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            ),
            headerRight: () => {
              <Button onPress={() => getConnectionList()} title="+" />;
            },
          })}
        />
      </Stack.Navigator>
    );
  }

  /**
   * Function to log out the user from the application. Takes the navigation object of react native as parameter.
   * @param {navigation} navigation navigation object of the react navigation library.
   */
  const logOut = (navigation) => {
    store.dispatch(logout());
    navigation.push("Login");
  };

  /**
   * Function to return the side drawer component for the Home screen.
   */
  function HomeDrawer() {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Logout"
              onPress={() => logOut(props.navigation)}
            />
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen name="Home" component={homeStack} />
        <Drawer.Screen name="Connection Requests" component={requestStack} />
        <Drawer.Screen name="My Profile" component={profileStack} />
        <Drawer.Screen name="My Messages" component={messageStack} />
      </Drawer.Navigator>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: "#7A1705",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen
              name="Home"
              component={HomeDrawer}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Paper List" component={PaperList} />
            <Stack.Screen name="Paper Details" component={PaperDetails} />
            <Stack.Screen name="Connections" component={Connections} />
            <Stack.Screen name="Message Room" component={MessageRoom} />
            <Stack.Screen name="Edit Profile" component={EditProfile} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
