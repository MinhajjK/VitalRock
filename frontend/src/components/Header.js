import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/userActions";
import "../styles/header.css";
import SearchBox from "./SearchBox";

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(logout());
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="organic-header">
      <Navbar expand="lg" collapseOnSelect className="organic-navbar">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="organic-brand">
              <div className="organic-brand-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <div className="organic-brand-text">
                <span className="organic-brand-name">VitalRock</span>
                <span className="organic-brand-tagline">Organic Store</span>
              </div>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <div className="header-search-wrapper">
              <SearchBox />
            </div>

            <Nav className="ml-auto align-items-center">
              {/* Cart Link */}
              <LinkContainer to="/cart">
                <Nav.Link className="organic-nav-link cart-link-wrapper">
                  <i className="fas fa-shopping-cart"></i>
                  <span>Cart</span>
                  {cartItems && cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                  )}
                </Nav.Link>
              </LinkContainer>

              {/* User Section */}
              {userInfo ? (
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <div className="user-avatar">
                        {getInitials(userInfo.name)}
                      </div>
                      <span>{userInfo.name}</span>
                    </span>
                  }
                  id="username"
                  className="organic-dropdown-toggle"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item className="organic-dropdown-item">
                      <i className="fas fa-user"></i>
                      <span>My Profile</span>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orders">
                    <NavDropdown.Item className="organic-dropdown-item">
                      <i className="fas fa-box"></i>
                      <span>My Orders</span>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider className="organic-dropdown-divider" />
                  <NavDropdown.Item
                    onClick={logoutHandler}
                    className="organic-dropdown-item"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="organic-nav-link">
                    <i className="fas fa-user"></i>
                    <span>Sign In</span>
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin Menu */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={
                    <span>
                      Admin <span className="admin-badge">Admin</span>
                    </span>
                  }
                  id="adminmenu"
                  className="organic-dropdown-toggle"
                >
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item className="organic-dropdown-item">
                      <i className="fas fa-tachometer-alt"></i>
                      <span>Dashboard</span>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider className="organic-dropdown-divider" />
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item className="organic-dropdown-item">
                      <i className="fas fa-users"></i>
                      <span>Users</span>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item className="organic-dropdown-item">
                      <i className="fas fa-box-open"></i>
                      <span>Products</span>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item className="organic-dropdown-item">
                      <i className="fas fa-shopping-bag"></i>
                      <span>Orders</span>
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
