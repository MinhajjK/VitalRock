import {
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGOUT,
  ADMIN_ROLE_LIST_REQUEST,
  ADMIN_ROLE_LIST_SUCCESS,
  ADMIN_ROLE_LIST_FAIL,
  ADMIN_ROLE_DETAILS_REQUEST,
  ADMIN_ROLE_DETAILS_SUCCESS,
  ADMIN_ROLE_DETAILS_FAIL,
  ADMIN_ROLE_CREATE_REQUEST,
  ADMIN_ROLE_CREATE_SUCCESS,
  ADMIN_ROLE_CREATE_FAIL,
  ADMIN_ROLE_UPDATE_REQUEST,
  ADMIN_ROLE_UPDATE_SUCCESS,
  ADMIN_ROLE_UPDATE_FAIL,
  ADMIN_ROLE_DELETE_REQUEST,
  ADMIN_ROLE_DELETE_SUCCESS,
  ADMIN_ROLE_DELETE_FAIL,
  ADMIN_PERMISSION_LIST_REQUEST,
  ADMIN_PERMISSION_LIST_SUCCESS,
  ADMIN_PERMISSION_LIST_FAIL,
} from '../constants/adminConstants'

// Admin Auth Reducer
export const adminAuthReducer = (state = {}, action) => {
  switch (action.type) {
    case ADMIN_LOGIN_REQUEST:
      return { loading: true }
    case ADMIN_LOGIN_SUCCESS:
      return { loading: false, adminInfo: action.payload }
    case ADMIN_LOGIN_FAIL:
      return { loading: false, error: action.payload }
    case ADMIN_LOGOUT:
      return {}
    default:
      return state
  }
}

// Admin Role List Reducer
export const adminRoleListReducer = (state = { roles: [] }, action) => {
  switch (action.type) {
    case ADMIN_ROLE_LIST_REQUEST:
      return { loading: true, roles: [] }
    case ADMIN_ROLE_LIST_SUCCESS:
      return { loading: false, roles: action.payload }
    case ADMIN_ROLE_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// Admin Role Details Reducer
export const adminRoleDetailsReducer = (state = { role: {} }, action) => {
  switch (action.type) {
    case ADMIN_ROLE_DETAILS_REQUEST:
      return { loading: true, ...state }
    case ADMIN_ROLE_DETAILS_SUCCESS:
      return { loading: false, role: action.payload }
    case ADMIN_ROLE_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// Admin Role Create Reducer
export const adminRoleCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ADMIN_ROLE_CREATE_REQUEST:
      return { loading: true }
    case ADMIN_ROLE_CREATE_SUCCESS:
      return { loading: false, success: true, role: action.payload }
    case ADMIN_ROLE_CREATE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// Admin Role Update Reducer
export const adminRoleUpdateReducer = (state = { role: {} }, action) => {
  switch (action.type) {
    case ADMIN_ROLE_UPDATE_REQUEST:
      return { loading: true }
    case ADMIN_ROLE_UPDATE_SUCCESS:
      return { loading: false, success: true, role: action.payload }
    case ADMIN_ROLE_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// Admin Role Delete Reducer
export const adminRoleDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ADMIN_ROLE_DELETE_REQUEST:
      return { loading: true }
    case ADMIN_ROLE_DELETE_SUCCESS:
      return { loading: false, success: true }
    case ADMIN_ROLE_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// Admin Permission List Reducer
export const adminPermissionListReducer = (state = { permissions: [] }, action) => {
  switch (action.type) {
    case ADMIN_PERMISSION_LIST_REQUEST:
      return { loading: true, permissions: [] }
    case ADMIN_PERMISSION_LIST_SUCCESS:
      return { loading: false, permissions: action.payload }
    case ADMIN_PERMISSION_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
