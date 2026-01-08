import axios from 'axios'
import {
  BRAND_LIST_REQUEST,
  BRAND_LIST_SUCCESS,
  BRAND_LIST_FAIL,
  BRAND_DETAILS_REQUEST,
  BRAND_DETAILS_SUCCESS,
  BRAND_DETAILS_FAIL,
  BRAND_VERIFIED_REQUEST,
  BRAND_VERIFIED_SUCCESS,
  BRAND_VERIFIED_FAIL,
} from '../constants/brandConstants'

export const listBrands = () => async (dispatch) => {
  try {
    dispatch({ type: BRAND_LIST_REQUEST })

    const { data } = await axios.get('/api/brands')

    dispatch({
      type: BRAND_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: BRAND_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listBrandDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BRAND_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/brands/${id}`)

    dispatch({
      type: BRAND_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: BRAND_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listVerifiedBrands = () => async (dispatch) => {
  try {
    dispatch({ type: BRAND_VERIFIED_REQUEST })

    const { data } = await axios.get('/api/brands/verified')

    dispatch({
      type: BRAND_VERIFIED_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: BRAND_VERIFIED_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
