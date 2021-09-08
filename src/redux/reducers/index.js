
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from "redux-saga";

import storeReducer from './store.reducer';
import menuReducer from './menu.reducer';
import userReducer from './user.reducer';
import categoryReducer from './category.reducer';
import tagReducer from './tag.reducer';
import cartReducer from './cart.reducer';
import commonReducer from './common.reducer';

import rootSaga from '../sagas';

let sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    storeReducer: storeReducer,
    menuReducer: menuReducer,
    userReducer: userReducer,
    categoryReducer: categoryReducer,
    tagReducer: tagReducer,
    cartReducer: cartReducer,
    commonReducer: commonReducer,
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
