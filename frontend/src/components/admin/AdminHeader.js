import React from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { logout } from '../../actions/userActions'

const AdminHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
    history.push('/admin/login')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="admin-header">
      <Navbar.Brand onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
        ☰ Menu
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/" target="_blank">
            View Store
          </Nav.Link>
          {userInfo && (
            <NavDropdown title={userInfo.name || userInfo.email} id="user-nav-dropdown">
              <NavDropdown.Item href="/admin/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default AdminHeader
