import { createReducer } from '@reduxjs/toolkit';
import { REQUEST, SUCCESS, FAILURE, MENU_ACTION } from '../constants';

const initialState = {
  menuList: {
    data: [],
    page: 1,
    load: false,
    error: null,
  },
  menuDetail: {
    data: {},
    load: false,
    error: null,
  },
}

const menuReducer = createReducer(initialState, {
  [REQUEST(MENU_ACTION.GET_MENU_LIST)]: (state, action) => {
    return {
      ...state,
      menuList: {
        ...state.menuList,
        load: true,
      },
    };
  },
  [SUCCESS(MENU_ACTION.GET_MENU_LIST)]: (state, action) => {
    const { data, page, more } = action.payload;
    if (more) {
      return {
        ...state,
        menuList: {
          ...state.menuList,
          data: [
            ...state.menuList.data,
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
        menuList: {
          ...state.menuList,
          data,
          page: 1,
          load: false,
          error: null,
        },
      }
    }
  },
  [FAILURE(MENU_ACTION.GET_MENU_LIST)]: (state, action) => {
    const { error } = action.payload;
    return {
      ...state,
      menuList: {
        ...state.menuList,
        load: false,
        error,
      },
    }
  },
});

export default menuReducer;
