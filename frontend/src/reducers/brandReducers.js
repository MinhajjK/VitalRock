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

export const brandListReducer = (state = { brands: [] }, action) => {
  switch (action.type) {
    case BRAND_LIST_REQUEST:
      return { loading: true, brands: [] }
    case BRAND_LIST_SUCCESS:
      return { loading: false, brands: action.payload }
    case BRAND_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const brandDetailsReducer = (state = { brand: {} }, action) => {
  switch (action.type) {
    case BRAND_DETAILS_REQUEST:
      return { ...state, loading: true }
    case BRAND_DETAILS_SUCCESS:
      return { loading: false, brand: action.payload }
    case BRAND_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const brandVerifiedReducer = (state = { brands: [] }, action) => {
  switch (action.type) {
    case BRAND_VERIFIED_REQUEST:
      return { loading: true, brands: [] }
    case BRAND_VERIFIED_SUCCESS:
      return { loading: false, brands: action.payload }
    case BRAND_VERIFIED_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
