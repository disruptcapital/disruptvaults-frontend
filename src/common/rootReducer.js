import { combineReducers } from 'redux';
import homeReducer from 'features/home/redux/reducer';
//import vaultReducer from 'features/vault/redux/reducer';
//import stakeReducer from 'features/stake/redux/reducer';
//import commonReducer from 'features/common/redux/reducer';

const reducerMap = {
  home: homeReducer,
  //vault: vaultReducer,
  //stake: stakeReducer,
  //common: commonReducer,
};

export default combineReducers(reducerMap);
