import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} />
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <AdminHeader toggleSidebar={toggleSidebar} />
        <Container fluid className="admin-content">
          {children}
        </Container>
      </div>
    </div>
  )
}

export default AdminLayout
