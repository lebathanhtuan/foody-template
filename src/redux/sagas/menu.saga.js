import { put, takeEvery, debounce } from "redux-saga/effects";
import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE, MENU_ACTION } from '../constants';
import { SERVER_API_URL } from './apiUrl';

import { STORE_LIMIT } from '../../constants/store';

function* getMenuListSaga(action) {
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
      ? `${SERVER_API_URL}/menus?${categoryParams}`
      : `${SERVER_API_URL}/menus`
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
      type: SUCCESS(MENU_ACTION.GET_MENU_LIST),
      payload: {
        data: result.data,
        page,
        more,
      },
    });
  } catch (e) {
    yield put({ type: FAILURE(MENU_ACTION.GET_MENU_LIST), payload: e.message });
  }
}

export default function* menuSaga() {
  yield debounce(300 ,REQUEST(MENU_ACTION.GET_MENU_LIST), getMenuListSaga);
}
