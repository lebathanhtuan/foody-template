import { createAction } from '@reduxjs/toolkit';
import { REQUEST, MENU_ACTION } from '../constants';

export const getMenuListAction = createAction(REQUEST(MENU_ACTION.GET_MENU_LIST));
