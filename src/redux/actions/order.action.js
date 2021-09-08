import { createAction } from '@reduxjs/toolkit';
import { REQUEST, ORDER_ACTION } from '../constants';

export const orderStoreAction = createAction(REQUEST(ORDER_ACTION.ORDER_STORE));
