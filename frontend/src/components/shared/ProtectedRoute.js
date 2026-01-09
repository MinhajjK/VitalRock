import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({
  component: Component,
  adminOnly = false,
  requiredPermission = null,
  ...rest
}) => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  return (
    <Route
      {...rest}
      render={(props) => {
        // Check if user is logged in
        if (!userInfo) {
          return (
            <Redirect
              to={{
                pathname: adminOnly ? '/admin/login' : '/login',
                state: { from: props.location },
              }}
            />
          )
        }

        // Check if admin access is required
        if (adminOnly) {
          const isAdmin =
            userInfo.isAdmin ||
            (userInfo.role && userInfo.role.level <= 2)

          if (!isAdmin) {
            return (
              <Redirect
                to={{
                  pathname: '/',
                  state: { from: props.location },
                }}
              />
            )
          }
        }

        // Check if specific permission is required
        if (requiredPermission) {
          // Get user permissions
          const userPermissions = userInfo.permissions || []
          const rolePermissions = userInfo.role?.permissions || []

          const allPermissions = [
            ...userPermissions.map((p) => p.slug),
            ...rolePermissions.map((p) => p.slug),
          ]

          // Super Admin (level 1) has all permissions
          const isSuperAdmin = userInfo.role?.level === 1

          if (!isSuperAdmin && !allPermissions.includes(requiredPermission)) {
            return (
              <Redirect
                to={{
                  pathname: adminOnly ? '/admin/dashboard' : '/',
                  state: { from: props.location },
                }}
              />
            )
          }
        }

        return <Component {...props} />
      }}
    />
  )
}

export default ProtectedRoute
