import { put, takeEvery } from "redux-saga/effects";
import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE, TAG_ACTION } from '../constants';
import { SERVER_API_URL } from './apiUrl';

function* getTagListSaga(action) {
  try {
    const result = yield axios.get(`${SERVER_API_URL}/tags`);
    yield put({
      type: SUCCESS(TAG_ACTION.GET_TAG_LIST),
      payload: {
        data: result.data
      },
    });
  } catch (e) {
    yield put({ type: FAILURE(TAG_ACTION.GET_TAG_LIST), payload: e.message });
  }
}

export default function* tagSaga() {
  yield takeEvery(REQUEST(TAG_ACTION.GET_TAG_LIST), getTagListSaga);
}
