import asyncHandler from 'express-async-handler'
import Certification from '../models/certificationModel.js'

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
const getCertifications = asyncHandler(async (req, res) => {
  const certifications = await Certification.find({ isActive: true }).sort({
    type: 1,
    name: 1,
  })

  res.json(certifications)
})

// @desc    Get single certification
// @route   GET /api/certifications/:id
// @access  Public
const getCertificationById = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id)

  if (certification) {
    res.json(certification)
  } else {
    res.status(404)
    throw new Error('Certification not found')
  }
})

// @desc    Get certifications by type
// @route   GET /api/certifications/type/:type
// @access  Public
const getCertificationsByType = asyncHandler(async (req, res) => {
  const certifications = await Certification.find({
    type: req.params.type,
    isActive: true,
  }).sort({ name: 1 })

  res.json(certifications)
})

// @desc    Create certification
// @route   POST /api/certifications
// @access  Private/Admin
const createCertification = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    description,
    logo,
    issuingAuthority,
    validityPeriod,
  } = req.body

  const certification = new Certification({
    name,
    type,
    description,
    logo: logo || '',
    issuingAuthority,
    validityPeriod: validityPeriod || 1,
  })

  const createdCertification = await certification.save()
  res.status(201).json(createdCertification)
})

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private/Admin
const updateCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id)

  if (certification) {
    certification.name = req.body.name || certification.name
    certification.type = req.body.type || certification.type
    certification.description =
      req.body.description || certification.description
    certification.logo =
      req.body.logo !== undefined ? req.body.logo : certification.logo
    certification.issuingAuthority =
      req.body.issuingAuthority || certification.issuingAuthority
    certification.validityPeriod =
      req.body.validityPeriod !== undefined
        ? req.body.validityPeriod
        : certification.validityPeriod
    certification.isActive =
      req.body.isActive !== undefined
        ? req.body.isActive
        : certification.isActive

    const updatedCertification = await certification.save()
    res.json(updatedCertification)
  } else {
    res.status(404)
    throw new Error('Certification not found')
  }
})

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private/Admin
const deleteCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id)

  if (certification) {
    await certification.remove()
    res.json({ message: 'Certification removed' })
  } else {
    res.status(404)
    throw new Error('Certification not found')
  }
})

export {
  getCertifications,
  getCertificationById,
  getCertificationsByType,
  createCertification,
  updateCertification,
  deleteCertification,
}
