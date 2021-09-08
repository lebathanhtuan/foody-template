import { put, takeEvery, debounce } from "redux-saga/effects";
import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE, STORE_ACTION } from '../constants';
import { SERVER_API_URL } from './apiUrl';

import history from '../../utils/history';
import { STORE_LIMIT } from '../../constants/store';

function* getStoreListSaga(action) {
  try {
    const page = action.payload?.page;
    const categoriesSelected = action.payload?.categoriesSelected;
    const priceRange = action.payload?.priceRange;
    const searchKey = action.payload?.searchKey;
    const more = action.payload?.more;
    let categoryParams = '';
    if (categoriesSelected) {
      categoriesSelected.forEach((categoryId, categoryIndex) => {
        const andParams = categoryIndex < categoriesSelected.length - 1 ? '&' : '';
        categoryParams = categoryParams + `categoryId=${categoryId}${andParams}`;
      });
    }
    const url = categoriesSelected?.length > 0
      ? `${SERVER_API_URL}/stores?${categoryParams}`
      : `${SERVER_API_URL}/stores`
    const result = yield axios({
      method: 'GET',
      url,
      params: {
        _sort: 'id',
        _order: 'desc',
        ...page && {
          _page: page,
          _limit: STORE_LIMIT,
        },
        ...priceRange && {
          price_gte: priceRange[0],
          price_lte: priceRange[1],
        },
        ...searchKey && { q: searchKey }
      }
    });
    yield put({
      type: SUCCESS(STORE_ACTION.GET_STORE_LIST),
      payload: {
        data: result.data,
        page,
        more,
      },
    });
  } catch (e) {
    yield put({ type: FAILURE(STORE_ACTION.GET_STORE_LIST), payload: e.message });
  }
}

function* getStoreDetailSaga(action) {
  try {
    const { id } = action.payload;
    const result = yield axios.get(`${SERVER_API_URL}/stores/${id}?_expand=category`);
    yield put({
      type: SUCCESS(STORE_ACTION.GET_STORE_DETAIL),
      payload: {
        data: result.data
      },
    });
  } catch (e) {
    yield put({ type: FAILURE(STORE_ACTION.GET_STORE_DETAIL), payload: e.message });
  }
}

function* createStoreSaga(action) {
  try {
    const { data } = action.payload;
    const result = yield axios.post(`${SERVER_API_URL}/stores`, data);
    yield put({
      type: SUCCESS(STORE_ACTION.CREATE_STORE),
      payload: {
        data: result.data,
      },
    });
    yield history.push('/admin/stores');
  } catch (e) {
    yield put({ type: FAILURE(STORE_ACTION.CREATE_STORE), payload: e.message });
  }
}

function* editStoreSaga(action) {
  try {
    const { id, data } = action.payload;
    const result = yield axios.patch(`${SERVER_API_URL}/stores/${id}`, data);
    yield put({
      type: SUCCESS(STORE_ACTION.EDIT_STORE),
      payload: {
        data: result.data,
      }
    });
    yield history.push('/admin/stores');
  } catch (e) {
    yield put({ type: FAILURE(STORE_ACTION.EDIT_STORE), payload: e.message });
  }
}

function* deleteStoreSaga(action) {
  try {
    const { id } = action.payload;
    yield axios.delete(`${SERVER_API_URL}/stores/${id}`);
    yield put({
      type: SUCCESS(STORE_ACTION.DELETE_STORE),
      payload: { id }
    });
  } catch (e) {
    yield put({ type: FAILURE(STORE_ACTION.DELETE_STORE), payload: e.message });
  }
}

export default function* storeSaga() {
  yield debounce(300 ,REQUEST(STORE_ACTION.GET_STORE_LIST), getStoreListSaga);
  yield takeEvery(REQUEST(STORE_ACTION.GET_STORE_DETAIL), getStoreDetailSaga);
  yield takeEvery(REQUEST(STORE_ACTION.CREATE_STORE), createStoreSaga);
  yield takeEvery(REQUEST(STORE_ACTION.EDIT_STORE), editStoreSaga);
  yield takeEvery(REQUEST(STORE_ACTION.DELETE_STORE), deleteStoreSaga);
}
