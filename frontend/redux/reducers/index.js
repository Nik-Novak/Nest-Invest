//@ts-check

import { combineReducers } from 'redux';

import loginReducer from './login-reducer';
import filterReducer from './filter-reducer';

export default combineReducers({
  login: loginReducer,
  filter: filterReducer
});