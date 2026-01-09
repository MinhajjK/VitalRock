import axios from 'axios'
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

// Admin Login
export const adminLogin = (email, password, twoFactorToken = null) => async (dispatch) => {
  try {
    dispatch({
      type: ADMIN_LOGIN_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      '/api/admin/auth/login',
      { email, password, twoFactorToken },
      config
    )

    dispatch({
      type: ADMIN_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('adminInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: ADMIN_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Admin Logout
export const adminLogout = () => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfo'))?.token}`,
      },
    }

    await axios.post('/api/admin/auth/logout', {}, config)
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    localStorage.removeItem('adminInfo')
    dispatch({ type: ADMIN_LOGOUT })
  }
}

// Get All Roles
export const listRoles = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_ROLE_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get('/api/admin/roles', config)

    dispatch({
      type: ADMIN_ROLE_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ADMIN_ROLE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Get Role Details
export const getRoleDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_ROLE_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/admin/roles/${id}`, config)

    dispatch({
      type: ADMIN_ROLE_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ADMIN_ROLE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Create Role
export const createRole = (roleData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_ROLE_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post('/api/admin/roles', roleData, config)

    dispatch({
      type: ADMIN_ROLE_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ADMIN_ROLE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Update Role
export const updateRole = (id, roleData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_ROLE_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/admin/roles/${id}`, roleData, config)

    dispatch({
      type: ADMIN_ROLE_UPDATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ADMIN_ROLE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Delete Role
export const deleteRole = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_ROLE_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/admin/roles/${id}`, config)

    dispatch({
      type: ADMIN_ROLE_DELETE_SUCCESS,
    })
  } catch (error) {
    dispatch({
      type: ADMIN_ROLE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Get All Permissions
export const listPermissions = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_PERMISSION_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get('/api/admin/roles/permissions/list', config)

    dispatch({
      type: ADMIN_PERMISSION_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ADMIN_PERMISSION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
