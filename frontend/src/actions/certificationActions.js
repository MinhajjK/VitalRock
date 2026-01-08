import axios from 'axios'
import {
  CERTIFICATION_LIST_REQUEST,
  CERTIFICATION_LIST_SUCCESS,
  CERTIFICATION_LIST_FAIL,
  CERTIFICATION_DETAILS_REQUEST,
  CERTIFICATION_DETAILS_SUCCESS,
  CERTIFICATION_DETAILS_FAIL,
  CERTIFICATION_BY_TYPE_REQUEST,
  CERTIFICATION_BY_TYPE_SUCCESS,
  CERTIFICATION_BY_TYPE_FAIL,
} from '../constants/certificationConstants'

export const listCertifications = () => async (dispatch) => {
  try {
    dispatch({ type: CERTIFICATION_LIST_REQUEST })

    const { data } = await axios.get('/api/certifications')

    dispatch({
      type: CERTIFICATION_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CERTIFICATION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listCertificationDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CERTIFICATION_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/certifications/${id}`)

    dispatch({
      type: CERTIFICATION_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CERTIFICATION_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listCertificationsByType = (type) => async (dispatch) => {
  try {
    dispatch({ type: CERTIFICATION_BY_TYPE_REQUEST })

    const { data } = await axios.get(`/api/certifications/type/${type}`)

    dispatch({
      type: CERTIFICATION_BY_TYPE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CERTIFICATION_BY_TYPE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
