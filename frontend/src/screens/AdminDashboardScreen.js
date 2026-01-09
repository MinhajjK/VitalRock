import React, { useEffect } from "react";
import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { listOrders } from "../actions/orderActions";
import { listProducts } from "../actions/productActions";
import { listUsers } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const AdminDashboardScreen = ({ history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productList = useSelector((state) => state.productList);
  const { products, loading: productsLoading } = productList;

  const orderList = useSelector((state) => state.orderList);
  const { orders, loading: ordersLoading } = orderList;

  const userList = useSelector((state) => state.userList);
  const { users, loading: usersLoading } = userList;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listProducts("", 1));
      dispatch(listOrders());
      dispatch(listUsers());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  // Calculate statistics
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalUsers = users?.length || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;
  const pendingOrders = orders?.filter((order) => !order.isPaid).length || 0;
  const lowStockProducts =
    products?.filter((product) => product.countInStock < 10).length || 0;

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Admin Dashboard</h1>
        </Col>
      </Row>

      {productsLoading || ordersLoading || usersLoading ? (
        <Loader />
      ) : (
        <>
          {/* Statistics Cards */}
          <Row className="my-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total Revenue</Card.Title>
                  <Card.Text as="h3" className="text-success">
                    ${totalRevenue.toFixed(2)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total Orders</Card.Title>
                  <Card.Text as="h3">{totalOrders}</Card.Text>
                  <LinkContainer to="/admin/orderlist">
                    <Card.Link>View All</Card.Link>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total Products</Card.Title>
                  <Card.Text as="h3">{totalProducts}</Card.Text>
                  <LinkContainer to="/admin/productlist">
                    <Card.Link>View All</Card.Link>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total Users</Card.Title>
                  <Card.Text as="h3">{totalUsers}</Card.Text>
                  <LinkContainer to="/admin/userlist">
                    <Card.Link>View All</Card.Link>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Alerts */}
          <Row className="my-4">
            <Col md={6}>
              <Card className="border-warning">
                <Card.Header>
                  <Badge variant="warning">Alerts</Badge>
                </Card.Header>
                <Card.Body>
                  {pendingOrders > 0 && (
                    <Message variant="warning">
                      {pendingOrders} pending order
                      {pendingOrders > 1 ? "s" : ""} need attention
                    </Message>
                  )}
                  {lowStockProducts > 0 && (
                    <Message variant="danger">
                      {lowStockProducts} product
                      {lowStockProducts > 1 ? "s" : ""} running low on stock
                    </Message>
                  )}
                  {pendingOrders === 0 && lowStockProducts === 0 && (
                    <Message variant="success">All systems operational</Message>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>
                  <strong>Quick Actions</strong>
                </Card.Header>
                <Card.Body>
                  <LinkContainer to="/admin/product/create">
                    <Card.Link>
                      <i className="fas fa-plus"></i> Add New Product
                    </Card.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/categories/create">
                    <Card.Link>
                      <i className="fas fa-plus"></i> Add New Category
                    </Card.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/brands/create">
                    <Card.Link>
                      <i className="fas fa-plus"></i> Add New Brand
                    </Card.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/certifications/create">
                    <Card.Link>
                      <i className="fas fa-plus"></i> Add New Certification
                    </Card.Link>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Orders */}
          <Row className="my-4">
            <Col>
              <Card>
                <Card.Header>
                  <strong>Recent Orders</strong>
                  <LinkContainer to="/admin/orderlist" className="float-right">
                    <Card.Link>View All</Card.Link>
                  </LinkContainer>
                </Card.Header>
                <Card.Body>
                  {orders && orders.length > 0 ? (
                    <Table
                      striped
                      bordered
                      hover
                      responsive
                      className="table-sm"
                    >
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>USER</th>
                          <th>DATE</th>
                          <th>TOTAL</th>
                          <th>PAID</th>
                          <th>DELIVERED</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id}>
                            <td>{order._id.substring(0, 10)}...</td>
                            <td>{order.user && order.user.name}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>${order.totalPrice}</td>
                            <td>
                              {order.isPaid ? (
                                <Badge variant="success">
                                  {order.paidAt.substring(0, 10)}
                                </Badge>
                              ) : (
                                <Badge variant="danger">Not Paid</Badge>
                              )}
                            </td>
                            <td>
                              {order.isDelivered ? (
                                <Badge variant="success">
                                  {order.deliveredAt.substring(0, 10)}
                                </Badge>
                              ) : (
                                <Badge variant="danger">Not Delivered</Badge>
                              )}
                            </td>
                            <td>
                              <LinkContainer to={`/order/${order._id}`}>
                                <Card.Link>
                                  <i className="fas fa-eye"></i>
                                </Card.Link>
                              </LinkContainer>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Message>No orders found</Message>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default AdminDashboardScreen;
