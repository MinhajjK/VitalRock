import React, { useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/Loader'
import Message from '../../components/Message'

const AdminDashboardScreen = () => {
  // TODO: Add dashboard stats action
  // const dispatch = useDispatch()
  // const dashboardStats = useSelector((state) => state.adminDashboard)

  // useEffect(() => {
  //   dispatch(getDashboardStats())
  // }, [dispatch])

  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>
      <Row>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <Card.Text>$0.00</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <Card.Text>0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <Card.Text>0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  )
}

export default AdminDashboardScreen
