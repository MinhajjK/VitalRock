import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector } from 'react-redux'
import PermissionGate from '../shared/PermissionGate'

const AdminSidebar = ({ isOpen }) => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: '📊',
      permission: 'analytics.dashboard.read',
    },
    {
      title: 'Store',
      path: '/admin/store',
      icon: '🏪',
      permission: 'store.profile.read',
      children: [
        { title: 'Profile', path: '/admin/store/profile', permission: 'store.profile.read' },
        { title: 'Settings', path: '/admin/store/settings', permission: 'store.settings.read' },
        { title: 'Banners', path: '/admin/store/banners', permission: 'store.banners.manage' },
      ],
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: '🥬',
      permission: 'products.read',
      children: [
        { title: 'All Products', path: '/admin/products', permission: 'products.read' },
        { title: 'Create Product', path: '/admin/products/create', permission: 'products.create' },
        { title: 'Categories', path: '/admin/products/categories', permission: 'products.categories.manage' },
      ],
    },
    {
      title: 'Inventory',
      path: '/admin/inventory',
      icon: '📦',
      permission: 'inventory.read',
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: '🛒',
      permission: 'orders.read',
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: '👥',
      permission: 'users.read',
    },
    {
      title: 'Reviews',
      path: '/admin/reviews',
      icon: '⭐',
      permission: 'reviews.read',
    },
    {
      title: 'Content',
      path: '/admin/content',
      icon: '📝',
      permission: 'content.blog.manage',
      children: [
        { title: 'Blog Posts', path: '/admin/content/blog', permission: 'content.blog.manage' },
        { title: 'FAQs', path: '/admin/content/faq', permission: 'content.faq.manage' },
      ],
    },
    {
      title: 'Promotions',
      path: '/admin/promotions',
      icon: '🎯',
      permission: 'promotions.coupons.manage',
      children: [
        { title: 'Coupons', path: '/admin/promotions/coupons', permission: 'promotions.coupons.manage' },
        { title: 'Campaigns', path: '/admin/promotions/campaigns', permission: 'promotions.campaigns.manage' },
      ],
    },
    {
      title: 'Analytics',
      path: '/admin/analytics',
      icon: '📈',
      permission: 'analytics.dashboard.read',
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: '⚙️',
      permission: 'settings.roles.manage',
      children: [
        { title: 'Roles & Permissions', path: '/admin/settings/roles', permission: 'settings.roles.manage' },
        { title: 'Activity Logs', path: '/admin/settings/activity', permission: 'settings.activity.read' },
        { title: 'Support Tickets', path: '/admin/settings/support', permission: 'settings.support.manage' },
      ],
    },
  ]

  const renderMenuItem = (item) => {
    return (
      <PermissionGate key={item.path} permission={item.permission}>
        <LinkContainer to={item.path}>
          <Nav.Link>
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-title">{item.title}</span>
          </Nav.Link>
        </LinkContainer>
        {item.children &&
          item.children.map((child) => (
            <PermissionGate key={child.path} permission={child.permission}>
              <LinkContainer to={child.path}>
                <Nav.Link className="sub-menu-item">
                  {child.title}
                </Nav.Link>
              </LinkContainer>
            </PermissionGate>
          ))}
      </PermissionGate>
    )
  }

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <Nav className="flex-column sidebar-nav">
        {menuItems.map(renderMenuItem)}
      </Nav>
    </aside>
  )
}

export default AdminSidebar
