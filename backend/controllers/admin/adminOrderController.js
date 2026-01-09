import asyncHandler from 'express-async-handler'
import Order from '../../models/orderModel.js'
import { logAdminActivity } from '../../utils/activityLogger.js'

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const pageSize = 20
  const page = Number(req.query.pageNumber) || 1

  const filter = {}

  // Status filter
  if (req.query.status) {
    if (req.query.status === 'pending') {
      filter.isPaid = false
      filter.isDelivered = false
    } else if (req.query.status === 'paid') {
      filter.isPaid = true
      filter.isDelivered = false
    } else if (req.query.status === 'delivered') {
      filter.isDelivered = true
    }
  }

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {}
    if (req.query.startDate) {
      filter.createdAt.$gte = new Date(req.query.startDate)
    }
    if (req.query.endDate) {
      filter.createdAt.$lte = new Date(req.query.endDate)
    }
  }

  // User filter
  if (req.query.user) {
    filter.user = req.query.user
  }

  const count = await Order.countDocuments(filter)
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  })
})

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email phone address'
  )

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  res.json(order)
})

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  const { status, notes } = req.body

  // Update order based on status
  if (status === 'paid') {
    order.isPaid = true
    order.paidAt = Date.now()
  } else if (status === 'delivered') {
    order.isDelivered = true
    order.deliveredAt = Date.now()
  } else if (status === 'processing') {
    order.isPaid = true
    order.isDelivered = false
  } else if (status === 'cancelled') {
    order.isPaid = false
    order.isDelivered = false
  }

  const updatedOrder = await order.save()

  await logAdminActivity(
    req.user,
    'order.status.updated',
    'Order',
    updatedOrder._id,
    {
      orderId: updatedOrder._id,
      newStatus: status,
      notes,
    },
    req
  )

  res.json(updatedOrder)
})

// @desc    Assign delivery partner
// @route   PUT /api/admin/orders/:id/assign-delivery
// @access  Private/Admin
const assignDeliveryPartner = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  const { deliveryPartnerId } = req.body

  // Note: This assumes deliveryPartnerId is a User ID
  // You may need to create a separate DeliveryPartner model
  order.assignedDeliveryPartner = deliveryPartnerId

  const updatedOrder = await order.save()

  await logAdminActivity(
    req.user,
    'order.delivery.assigned',
    'Order',
    updatedOrder._id,
    {
      orderId: updatedOrder._id,
      deliveryPartnerId,
    },
    req
  )

  res.json(updatedOrder)
})

// @desc    Cancel order (admin)
// @route   POST /api/admin/orders/:id/cancel
// @access  Private/Admin
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (order.isDelivered) {
    res.status(400)
    throw new Error('Cannot cancel delivered order')
  }

  const { reason } = req.body

  order.isPaid = false
  order.cancellationReason = reason
  order.cancellationRequestedAt = Date.now()
  order.cancellationApprovedAt = Date.now()

  const updatedOrder = await order.save()

  await logAdminActivity(
    req.user,
    'order.cancelled',
    'Order',
    updatedOrder._id,
    {
      orderId: updatedOrder._id,
      reason,
    },
    req
  )

  res.json(updatedOrder)
})

// @desc    Process refund
// @route   POST /api/admin/orders/:id/refund
// @access  Private/Admin
const processRefund = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (!order.isPaid) {
    res.status(400)
    throw new Error('Order is not paid')
  }

  const { refundAmount, reason } = req.body

  order.refundStatus = 'processed'
  order.refundAmount = refundAmount || order.totalPrice
  order.refundReason = reason
  order.refundProcessedAt = Date.now()

  const updatedOrder = await order.save()

  await logAdminActivity(
    req.user,
    'order.refund.processed',
    'Order',
    updatedOrder._id,
    {
      orderId: updatedOrder._id,
      refundAmount: order.refundAmount,
      reason,
    },
    req
  )

  res.json(updatedOrder)
})

// @desc    Generate invoice (placeholder - would need PDF generation)
// @route   GET /api/admin/orders/:id/invoice
// @access  Private/Admin
const generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email address'
  )

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  // Generate invoice number if not exists
  if (!order.invoiceNumber) {
    order.invoiceNumber = `INV-${Date.now()}-${order._id.toString().slice(-6)}`
    await order.save()
  }

  // TODO: Generate PDF invoice
  // For now, return order data as JSON
  res.json({
    invoiceNumber: order.invoiceNumber,
    order,
    generatedAt: new Date(),
  })
})

// @desc    Get order analytics
// @route   GET /api/admin/orders/analytics
// @access  Private/Admin
const getOrderAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query

  const filter = {}
  if (startDate || endDate) {
    filter.createdAt = {}
    if (startDate) filter.createdAt.$gte = new Date(startDate)
    if (endDate) filter.createdAt.$lte = new Date(endDate)
  }

  const totalOrders = await Order.countDocuments(filter)
  const totalRevenue = await Order.aggregate([
    { $match: { ...filter, isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ])

  const pendingOrders = await Order.countDocuments({
    ...filter,
    isPaid: false,
    isDelivered: false,
  })

  const deliveredOrders = await Order.countDocuments({
    ...filter,
    isDelivered: true,
  })

  res.json({
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    pendingOrders,
    deliveredOrders,
    paidOrders: totalOrders - pendingOrders,
  })
})

export {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  assignDeliveryPartner,
  cancelOrder,
  processRefund,
  generateInvoice,
  getOrderAnalytics,
}
