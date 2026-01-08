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

export const certificationListReducer = (
  state = { certifications: [] },
  action
) => {
  switch (action.type) {
    case CERTIFICATION_LIST_REQUEST:
      return { loading: true, certifications: [] }
    case CERTIFICATION_LIST_SUCCESS:
      return { loading: false, certifications: action.payload }
    case CERTIFICATION_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const certificationDetailsReducer = (
  state = { certification: {} },
  action
) => {
  switch (action.type) {
    case CERTIFICATION_DETAILS_REQUEST:
      return { ...state, loading: true }
    case CERTIFICATION_DETAILS_SUCCESS:
      return { loading: false, certification: action.payload }
    case CERTIFICATION_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const certificationByTypeReducer = (
  state = { certifications: [] },
  action
) => {
  switch (action.type) {
    case CERTIFICATION_BY_TYPE_REQUEST:
      return { loading: true, certifications: [] }
    case CERTIFICATION_BY_TYPE_SUCCESS:
      return { loading: false, certifications: action.payload }
    case CERTIFICATION_BY_TYPE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
