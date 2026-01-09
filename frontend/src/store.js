import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import {
  adminAuthReducer,
  adminPermissionListReducer,
  adminRoleCreateReducer,
  adminRoleDeleteReducer,
  adminRoleDetailsReducer,
  adminRoleListReducer,
  adminRoleUpdateReducer,
} from "./reducers/adminReducers";
import {
  brandDetailsReducer,
  brandListReducer,
  brandVerifiedReducer,
} from "./reducers/brandReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  categoryDetailsReducer,
  categoryListReducer,
  categoryTreeReducer,
} from "./reducers/categoryReducers";
import {
  certificationByTypeReducer,
  certificationDetailsReducer,
  certificationListReducer,
} from "./reducers/certificationReducers";
import {
  orderCreateReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderListMyReducer,
  orderListReducer,
  orderPayReducer,
} from "./reducers/orderReducers";
import {
  productCreateReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
  productUpdateReducer,
} from "./reducers/productReducers";
import {
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./reducers/userReducers";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  categoryTree: categoryTreeReducer,
  brandList: brandListReducer,
  brandDetails: brandDetailsReducer,
  brandVerified: brandVerifiedReducer,
  certificationList: certificationListReducer,
  certificationDetails: certificationDetailsReducer,
  certificationByType: certificationByTypeReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  adminAuth: adminAuthReducer,
  adminRoleList: adminRoleListReducer,
  adminRoleDetails: adminRoleDetailsReducer,
  adminRoleCreate: adminRoleCreateReducer,
  adminRoleUpdate: adminRoleUpdateReducer,
  adminRoleDelete: adminRoleDeleteReducer,
  adminPermissionList: adminPermissionListReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk].filter(Boolean);

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
