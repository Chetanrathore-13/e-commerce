import { connectToDatabase } from "@/lib/mongodb"
import { Brand, Category, Product, Variation } from "@/lib/models"
import { isValidObjectId } from "mongoose"

// Stats for dashboard
export async function getStats() {
  await connectToDatabase()

  const [
    totalProducts,
    totalCategories,
    totalBrands,
    totalVariations,
    newProducts,
    newCategories,
    newBrands,
    newVariations,
  ] = await Promise.all([
    Product.countDocuments({}),
    Category.countDocuments({}),
    Brand.countDocuments({}),
    Variation.countDocuments({}),
    Product.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
    Category.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
    Brand.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
    Variation.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
  ])

  return {
    totalProducts,
    totalCategories,
    totalBrands,
    totalVariations,
    newProducts,
    newCategories,
    newBrands,
    newVariations,
  }
}

// Get brands with pagination
export async function getBrands({ page = 1, per_page = 10 }) {
  await connectToDatabase()

  const skip = (page - 1) * per_page

  const [brands, totalBrands] = await Promise.all([
    Brand.find({}).sort({ createdAt: -1 }).skip(skip).limit(per_page).lean(),
    Brand.countDocuments({}),
  ])

  const totalPages = Math.ceil(totalBrands / per_page)

  return {
    brands,
    totalPages,
  }
}

// Get brand by ID
export async function getBrandById(id: string) {
  if (!isValidObjectId(id)) return null

  await connectToDatabase()

  const brand = await Brand.findById(id).lean()

  return brand
}

// Get categories with pagination
export async function getCategories({ page = 1, per_page = 10 }) {
  await connectToDatabase()

  const skip = (page - 1) * per_page

  const [categories, totalCategories] = await Promise.all([
    Category.find({}).populate("parent_category_id", "name").sort({ createdAt: -1 }).skip(skip).limit(per_page).lean(),
    Category.countDocuments({}),
  ])

  const totalPages = Math.ceil(totalCategories / per_page)

  return {
    categories,
    totalPages,
  }
}

// Get category by ID
export async function getCategoryById(id: string) {
  if (!isValidObjectId(id)) return null

  await connectToDatabase()

  const category = await Category.findById(id).populate("parent_category_id", "name").lean()

  return category
}

// Get products with pagination
export async function getProducts({ page = 1, per_page = 10 }) {
  await connectToDatabase()

  const skip = (page - 1) * per_page

  const [products, totalProducts] = await Promise.all([
    Product.find({})
      .populate("brand_id", "name")
      .populate("category_id", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(per_page)
      .lean(),
    Product.countDocuments({}),
  ])

  const totalPages = Math.ceil(totalProducts / per_page)

  return {
    products,
    totalPages,
  }
}

// Get product by ID
export async function getProductById(id: string) {
  if (!isValidObjectId(id)) return null

  await connectToDatabase()

  const product = await Product.findById(id).populate("brand_id", "name").populate("category_id", "name").lean()

  return product
}

// Get variations by product ID with pagination
export async function getVariationsByProductId(productId: string, { page = 1, per_page = 10 }) {
  if (!isValidObjectId(productId)) return { variations: [], totalPages: 0 }

  await connectToDatabase()

  const skip = (page - 1) * per_page

  const [variations, totalVariations] = await Promise.all([
    Variation.find({ product_id: productId }).sort({ createdAt: -1 }).skip(skip).limit(per_page).lean(),
    Variation.countDocuments({ product_id: productId }),
  ])

  const totalPages = Math.ceil(totalVariations / per_page)

  return {
    variations,
    totalPages,
  }
}

// Get variation by ID
export async function getVariationById(id: string) {
  if (!isValidObjectId(id)) return null

  await connectToDatabase()

  const variation = await Variation.findById(id).populate("product_id", "name").lean()

  return variation
}
