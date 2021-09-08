import { createReducer } from '@reduxjs/toolkit';
import { REQUEST, SUCCESS, FAILURE, STORE_ACTION } from '../constants';

const initialState = {
  storeList: {
    data: [],
    page: 1,
    load: false,
    error: null,
  },
  storeDetail: {
    data: {},
    load: false,
    error: null,
  },
}

const storeReducer = createReducer(initialState, {
  [REQUEST(STORE_ACTION.GET_STORE_LIST)]: (state, action) => {
    return {
      ...state,
      storeList: {
        ...state.storeList,
        load: true,
      },
    };
  },
  [SUCCESS(STORE_ACTION.GET_STORE_LIST)]: (state, action) => {
    const { data, page, more } = action.payload;
    if (more) {
      return {
        ...state,
        storeList: {
          ...state.storeList,
          data: [
            ...state.storeList.data,
            ...data,
          ],
          page,
          load: false,
          error: null,
        },
      }
    } else {
      return {
        ...state,
        storeList: {
          ...state.storeList,
          data,
          page: 1,
          load: false,
          error: null,
        },
      }
    }
  },
  [FAILURE(STORE_ACTION.GET_STORE_LIST)]: (state, action) => {
    const { error } = action.payload;
    return {
      ...state,
      storeList: {
        ...state.storeList,
        load: false,
        error,
      },
    }
  },

  [REQUEST(STORE_ACTION.GET_STORE_DETAIL)]: (state, action) => {
    return {
      ...state,
      storeDetail: {
        ...state.storeDetail,
        load: true,
      },
    };
  },
  [SUCCESS(STORE_ACTION.GET_STORE_DETAIL)]: (state, action) => {
    const { data } = action.payload;
    return {
      ...state,
      storeDetail: {
        ...state.storeDetail,
        data,
        load: false,
        error: null,
      },
    }
  },
  [FAILURE(STORE_ACTION.GET_STORE_DETAIL)]: (state, action) => {
    const { error } = action.payload;
    return {
      ...state,
      storeDetail: {
        ...state.storeDetail,
        load: false,
        error,
      },
    }
  },

  [SUCCESS(STORE_ACTION.CREATE_STORE)]: (state, action) => {
    const { data } = action.payload;
    return {
      ...state,
      storeList: {
        ...state.storeList,
        data: [
          data,
          ...state.storeList.data,
        ],
      },
    }
  },

  [SUCCESS(STORE_ACTION.EDIT_STORE)]: (state, action) => {
    const { data } = action.payload;
    const newStoreList = [...state.storeList.data];
    const storeIndex = newStoreList.findIndex((store) => store.id === data.id);
    newStoreList.splice(storeIndex, 1, data);
    return {
      ...state,
      storeList: {
        ...state.storeList,
        data: newStoreList,
      },
    };
  },

  [SUCCESS(STORE_ACTION.DELETE_STORE)]: (state, action) => {
    const { id } = action.payload;
    const newStoreList = [...state.storeList.data];
    const storeIndex = newStoreList.findIndex((store) => store.id === id);
    newStoreList.splice(storeIndex, 1);
    return {
      ...state,
      storeList: {
        ...state.storeList,
        data: newStoreList,
      },
    };
  },
});

export default storeReducer;
