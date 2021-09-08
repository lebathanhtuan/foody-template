import { createAction } from '@reduxjs/toolkit';
import { REQUEST, STORE_ACTION } from '../constants';

export const getStoreListAction = createAction(REQUEST(STORE_ACTION.GET_STORE_LIST));
export const getStoreDetailAction = createAction(REQUEST(STORE_ACTION.GET_STORE_DETAIL));
export const createStoreAction = createAction(REQUEST(STORE_ACTION.CREATE_STORE));
export const editStoreAction = createAction(REQUEST(STORE_ACTION.EDIT_STORE));
export const deleteStoreAction = createAction(REQUEST(STORE_ACTION.DELETE_STORE));
