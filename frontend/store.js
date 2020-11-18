import AsyncStorage from "@react-native-community/async-storage";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { rootReducer } from "./Reducers/Rootreducer";

const persistConfig = {
  key: "root32",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
let persistor = persistStore(store);

export { store, persistor };
