import React from 'react'
import { useSelector } from 'react-redux'

const RoleBasedComponent = ({
  children,
  adminComponent = null,
  userComponent = null,
  defaultComponent = null,
}) => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!userInfo) {
    return defaultComponent || null
  }

  const isAdmin =
    userInfo.isAdmin || (userInfo.role && userInfo.role.level <= 2)

  if (isAdmin && adminComponent) {
    return <>{adminComponent}</>
  }

  if (!isAdmin && userComponent) {
    return <>{userComponent}</>
  }

  return <>{children || defaultComponent}</>
}

export default RoleBasedComponent
