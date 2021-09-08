import { fork } from 'redux-saga/effects';

import storeSaga from './store.saga';
import menuSaga from './menu.saga';
import userSaga from './user.saga';
import categorySaga from './category.saga';
import tagSaga from './tag.saga';
import cartSaga from './cart.saga';
import orderSaga from './order.saga';

export default function* rootSaga() {
  yield fork(storeSaga);
  yield fork(menuSaga);
  yield fork(userSaga);
  yield fork(categorySaga);
  yield fork(tagSaga);
  yield fork(cartSaga);
  yield fork(orderSaga);
}