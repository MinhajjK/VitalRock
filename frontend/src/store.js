import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
} from './reducers/productReducers'
import {
  categoryListReducer,
  categoryDetailsReducer,
  categoryTreeReducer,
} from './reducers/categoryReducers'
import {
  brandListReducer,
  brandDetailsReducer,
  brandVerifiedReducer,
} from './reducers/brandReducers'
import {
  certificationListReducer,
  certificationDetailsReducer,
  certificationByTypeReducer,
} from './reducers/certificationReducers'
import { cartReducer } from './reducers/cartReducers'
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './reducers/userReducers'
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderDeliverReducer,
  orderListMyReducer,
  orderListReducer,
} from './reducers/orderReducers'
import {
  adminAuthReducer,
  adminRoleListReducer,
  adminRoleDetailsReducer,
  adminRoleCreateReducer,
  adminRoleUpdateReducer,
  adminRoleDeleteReducer,
  adminPermissionListReducer,
} from './reducers/adminReducers'

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
})

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
