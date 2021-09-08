import { createReducer } from '@reduxjs/toolkit';
import { REQUEST, SUCCESS, FAILURE, TAG_ACTION } from '../constants';

const initialState = {
  tagList: {
    data: [],
    load: false,
    error: null,
  },
}

const tagReducer = createReducer(initialState, {
  [REQUEST(TAG_ACTION.GET_TAG_LIST)]: (state, action) => {
    return {
      ...state,
      tagList: {
        ...state.tagList,
        load: true,
      },
    };
  },
  [SUCCESS(TAG_ACTION.GET_TAG_LIST)]: (state, action) => {
    const { data } = action.payload;
    return {
      ...state,
      tagList: {
        data,
        load: false,
        error: null,
      },
    }
  },
  [FAILURE(TAG_ACTION.GET_TAG_LIST)]: (state, action) => {
    const { error } = action.payload;
    return {
      ...state,
      tagList: {
        ...state.tagList,
        load: false,
        error,
      },
    }
  },
});

export default tagReducer;
