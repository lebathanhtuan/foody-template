import { createAction } from '@reduxjs/toolkit';
import { REQUEST, TAG_ACTION } from '../constants';

export const getTagListAction = createAction(REQUEST(TAG_ACTION.GET_TAG_LIST));
