import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import organicProducts from './data/organicProducts.js'
import categories from './data/categories.js'
import brands from './data/brands.js'
import certifications from './data/certifications.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Category from './models/categoryModel.js'
import Brand from './models/brandModel.js'
import Certification from './models/certificationModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany()
    await Product.deleteMany()
    await Category.deleteMany()
    await Brand.deleteMany()
    await Certification.deleteMany()
    await User.deleteMany()

    // Import users
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    // Import certifications
    const createdCertifications = await Certification.insertMany(certifications)
    const certMap = {}
    createdCertifications.forEach((cert) => {
      certMap[cert.name] = cert._id
    })

    // Import brands and add certifications
    const brandsWithCerts = brands.map((brand) => {
      // Add relevant certifications to brands
      const brandCerts = []
      if (brand.name === 'Himalayan Organic') {
        brandCerts.push(certMap['USDA Organic'])
        brandCerts.push(certMap['Certified Vegan'])
      } else if (brand.name === 'Pure Organic') {
        brandCerts.push(certMap['USDA Organic'])
        brandCerts.push(certMap['Fair Trade Certified'])
        brandCerts.push(certMap['Non-GMO Project Verified'])
      } else if (brand.name === "Nature's Best") {
        brandCerts.push(certMap['USDA Organic'])
        brandCerts.push(certMap['Fair Trade Certified'])
        brandCerts.push(certMap['Certified Vegan'])
      }
      return { ...brand, certifications: brandCerts }
    })

    const createdBrands = await Brand.insertMany(brandsWithCerts)
    const brandMap = {}
    createdBrands.forEach((brand) => {
      brandMap[brand.name] = brand._id
    })

    // Import categories
    const createdCategories = await Category.insertMany(categories)
    const categoryMap = {}
    createdCategories.forEach((category) => {
      categoryMap[category.name] = category._id
    })

    // Import products with references
    const productsWithRefs = organicProducts.map((product) => {
      const productData = {
        ...product,
        user: adminUser,
        brandRef: brandMap[product.brand] || null,
        categoryRef: categoryMap[product.category] || null,
        certifications: [],
      }

      // Add certifications based on product type
      if (product.isOrganic) {
        productData.certifications.push(certMap['USDA Organic'])
      }
      if (product.isFairTrade) {
        productData.certifications.push(certMap['Fair Trade Certified'])
      }
      if (product.isVegan) {
        productData.certifications.push(certMap['Certified Vegan'])
      }
      if (product.isGlutenFree) {
        productData.certifications.push(certMap['Gluten-Free Certification'])
      }

      return productData
    })

    await Product.insertMany(productsWithRefs)

    console.log('Organic Store Data Imported!'.green.inverse)
    console.log(`- ${createdUsers.length} Users`.green)
    console.log(`- ${createdCategories.length} Categories`.green)
    console.log(`- ${createdBrands.length} Brands`.green)
    console.log(`- ${createdCertifications.length} Certifications`.green)
    console.log(`- ${productsWithRefs.length} Products`.green)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await Category.deleteMany()
    await Brand.deleteMany()
    await Certification.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
