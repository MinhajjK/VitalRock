import axios from 'axios'
import {
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  CATEGORY_TREE_REQUEST,
  CATEGORY_TREE_SUCCESS,
  CATEGORY_TREE_FAIL,
} from '../constants/categoryConstants'

export const listCategories = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST })

    const { data } = await axios.get('/api/categories')

    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listCategoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/categories/${id}`)

    dispatch({
      type: CATEGORY_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listCategoryTree = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_TREE_REQUEST })

    const { data } = await axios.get('/api/categories/tree')

    dispatch({
      type: CATEGORY_TREE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_TREE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
