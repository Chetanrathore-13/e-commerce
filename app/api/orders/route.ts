import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Product, Variation, User } from "@/lib/models"
import  {Order}  from "@/lib/models/order"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { emailService } from "@/lib/services/email"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { Cart } from "@/lib/models/index"

// Get user's orders
export async function GET() {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId: string = session.user.id

    // Find orders for the user
    const orders = await Order.find({ user_id: userId }).sort({ createdAt: -1 }).lean()

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// Create a new order
export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    const data = await request.json()

   

    // Validate required fields
    if (!data.shipping_address || !data.billing_address || !data.payment_method) {
      console.error("Missing required fields:", {
        shipping_address: !!data.shipping_address,
        billing_address: !!data.billing_address,
        payment_method: !!data.payment_method,
      })
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            shipping_address: !data.shipping_address ? "Required" : "Present",
            billing_address: !data.billing_address ? "Required" : "Present",
            payment_method: !data.payment_method ? "Required" : "Present",
          },
        },
        { status: 400 },
      )
    }

    // Validate customer information for guest checkout
    if (!session && (!data.customer || !data.customer.email || !data.customer.name)) {
      return NextResponse.json(
        {
          error: "Customer information required for guest checkout",
        },
        { status: 400 },
      )
    }

    // Validate shipping address structure
    const requiredAddressFields = ["full_name", "address_line1", "city", "state", "postal_code", "country", "phone"]
    for (const field of requiredAddressFields) {
      if (!data.shipping_address[field]) {
        console.error(`Missing shipping address field: ${field}`)
        return NextResponse.json(
          {
            error: `Missing required shipping address field: ${field}`,
          },
          { status: 400 },
        )
      }
    }

    let userId = session?.user?.id
    let user = null
    let accountCreated = false
    let generatedPassword = null

    // Handle guest checkout - register or find user
    if (!session) {
      const customerEmail = data.customer.email.toLowerCase().trim()
      const customerName = data.customer.name.trim()
      const customerPhone = data.customer.phone?.trim()

      // Check if user already exists
      const existingUser = await User.findOne({ email: customerEmail })

      if (existingUser) {
        // User exists, use existing user
        userId = existingUser._id.toString()
        user = existingUser

       

        // Send order confirmation email (user already has account)
        try {
          await emailService.sendEmail(customerEmail, {
            subject: "Order Confirmation - Existing Account",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
                  <p style="color: white; margin: 10px 0 0 0;">Welcome back, ${customerName}!</p>
                </div>
                
                <div style="padding: 30px; background: #f9fafb;">
                  <h2 style="color: #1f2937; margin-bottom: 20px;">Order Details</h2>
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>Total Amount:</strong> ₹${data.total || "0"}</p>
                    <p><strong>Payment Method:</strong> ${data.payment_method || "N/A"}</p>
                    <p><strong>Items:</strong> ${data.items?.length || 0} items</p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #6b7280;">You can track your order by logging into your account.</p>
                  </div>
                </div>
                
                <div style="background: #1f2937; padding: 20px; text-align: center;">
                  <p style="color: #9ca3af; margin: 0;">Thank you for shopping with us!</p>
                </div>
              </div>
            `,
          })
        } catch (emailError) {
          console.error("Error sending existing user email:", emailError)
        }
      } else if (data.customer.create_account) {
        // Create new user account
        try {
          // Generate a random password
          generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
          const hashedPassword = await bcrypt.hash(generatedPassword, 10)

          const newUser = new User({
            name: customerName,
            email: customerEmail,
            password: hashedPassword,
            role: "user",
          })

          await newUser.save()
          userId = newUser._id.toString()
          user = newUser
          accountCreated = true

         

          // Send welcome email with credentials
          try {
            await emailService.sendEmail(customerEmail, {
              subject: "Welcome! Your Account & Order Confirmation",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Welcome & Order Confirmed!</h1>
                    <p style="color: white; margin: 10px 0 0 0;">Your account has been created successfully</p>
                  </div>
                  
                  <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #1f2937; margin-bottom: 20px;">Your Account Details</h2>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #8b5cf6;">
                      <p><strong>Email:</strong> ${customerEmail}</p>
                      <p><strong>Password:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${generatedPassword}</code></p>
                      <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
                        <strong>Important:</strong> Please save these credentials and change your password after logging in.
                      </p>
                    </div>

                    <h2 style="color: #1f2937; margin-bottom: 20px;">Order Details</h2>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                      <p><strong>Total Amount:</strong> ₹${data.total || "0"}</p>
                      <p><strong>Payment Method:</strong> ${data.payment_method || "N/A"}</p>
                      <p><strong>Items:</strong> ${data.items?.length || 0} items</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/login" 
                         style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px;">
                        Login to Your Account
                      </a>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/account/orders" 
                         style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                        Track Your Order
                      </a>
                    </div>
                  </div>
                  
                  <div style="background: #1f2937; padding: 20px; text-align: center;">
                    <p style="color: #9ca3af; margin: 0;">Thank you for joining us and for your order!</p>
                  </div>
                </div>
              `,
            })
          } catch (emailError) {
            console.error("Error sending welcome email:", emailError)
          }
        } catch (error) {
          console.error("Error creating user account:", error)
          // Continue with guest order even if account creation fails
          userId = undefined
        }
      } else {
        // Guest checkout without account creation
       
        userId = undefined // No user ID for guest checkout

        // Send guest order confirmation email
        try {
          await emailService.sendEmail(customerEmail, {
            subject: "Order Confirmation - Guest Checkout",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
                  <p style="color: white; margin: 10px 0 0 0;">Thank you for your order, ${customerName}!</p>
                </div>
                
                <div style="padding: 30px; background: #f9fafb;">
                  <h2 style="color: #1f2937; margin-bottom: 20px;">Order Details</h2>
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>Total Amount:</strong> ₹${data.total || "0"}</p>
                    <p><strong>Payment Method:</strong> ${data.payment_method || "N/A"}</p>
                    <p><strong>Items:</strong> ${data.items?.length || 0} items</p>
                  </div>
                  
                  <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="color: #92400e; margin: 0; font-size: 14px;">
                      <strong>Create an account</strong> to easily track your orders and enjoy faster checkout next time!
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/register" 
                       style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                      Create Account
                    </a>
                  </div>
                </div>
                
                <div style="background: #1f2937; padding: 20px; text-align: center;">
                  <p style="color: #9ca3af; margin: 0;">Thank you for shopping with us!</p>
                </div>
              </div>
            `,
          })
        } catch (emailError) {
          console.error("Error sending guest order email:", emailError)
        }
      }
    } else {
      // Authenticated user
      user = await User.findById(userId).lean()
      if (!user) {
        console.error("Authenticated user not found:", userId)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
    }

    // Get cart items (from context data for guest users, or database for authenticated users)
    let orderItems = []
    let subtotal = 0

    if (data.items && Array.isArray(data.items)) {
      // Use items from request (guest checkout)
      orderItems = data.items.map((item: any) => ({
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
      }))

      subtotal = data.subtotal || orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    } else if (userId) {
      // Get cart from database (authenticated user)
      const cart: any = await Cart.findOne({ user_id: userId }).lean()
      if (!cart || !cart.items || cart.items.length === 0) {
        console.error("Cart is empty for user:", userId)
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
      }

      // Process cart items
      for (const item of cart.items) {
        try {
          const product: any = await Product.findById(item.product_id).lean()
          const variation: any = await Variation.findById(item.variation_id).lean()

          if (!product || !variation) {
            console.warn(`Product or variation not found for item:`, item)
            continue
          }

          // Check if item is still in stock
          if (variation.quantity < item.quantity) {
            return NextResponse.json(
              {
                error: `Not enough stock for ${product.name} (${variation.color}, ${variation.size})`,
              },
              { status: 400 },
            )
          }

          // Add item to order
          orderItems.push({
            product_id: item.product_id,
            variation_id: item.variation_id,
            quantity: item.quantity,
            price: item.price,
            name: product.name,
            image: variation.image,
            size: variation.size,
            color: variation.color,
          })

          // Update subtotal
          subtotal += item.price * item.quantity

          // Update product variation quantity
          await Variation.findByIdAndUpdate(item.variation_id, {
            $inc: { quantity: -item.quantity },
          })
        } catch (err) {
          console.error("Error processing cart item:", err)
        }
      }

      // Clear the cart after processing
      await Cart.findOneAndUpdate({ user_id: userId }, { $set: { items: [], total: 0 } })
    } else {
      return NextResponse.json({ error: "No items found for order" }, { status: 400 })
    }

    if (orderItems.length === 0) {
      console.error("No valid items for order")
      return NextResponse.json({ error: "No valid items in order" }, { status: 400 })
    }

    

    // Apply discount if coupon is provided
    let discountAmount = 0
    if (data.coupon_code && data.discount_amount) {
      discountAmount = data.discount_amount
    }

    // Calculate final total
    const total = subtotal - discountAmount

    // Generate order number
    const orderCount = await Order.countDocuments()
    const orderNumber = `ORD${new Date().getFullYear()}${(orderCount + 1).toString().padStart(6, "0")}`

   

    // Create order
    const orderData = {
      user_id: userId ? new mongoose.Types.ObjectId(userId) : null,
      order_number: orderNumber,
      items: orderItems,
      total,
      subtotal,
      discount: discountAmount,
      coupon_code: data.coupon_code || null,
      status: "pending",
      shipping_address: data.shipping_address,
      billing_address: data.billing_address,
      payment_method: data.payment_method,
      payment_status:
        data.payment_method === "cod"
          ? "pending"
          : data.payment_method === "razorpay"
            ? "pending"
            : data.payment_method === "phonepe"
              ? "pending"
              : "processing",
      // Guest order information
      guest_email: !userId ? data.customer?.email : null,
      guest_name: !userId ? data.customer?.name : null,
      guest_phone: !userId ? data.customer?.phone : null,
    }

   
    const order = new Order(orderData)
    await order.save()

   

    return NextResponse.json({
      success: true,
      message: accountCreated
        ? "Order placed successfully! Your account has been created and login credentials have been sent to your email."
        : "Order placed successfully!",
      order: {
        _id: order._id,
        order_number: order.order_number,
        total: order.total,
        payment_method: order.payment_method,
      },
      account_created: accountCreated,
      password: accountCreated ? generatedPassword : null,
    })
  } catch (error: any) {
    console.error("Error creating order:", error)
    console.error("Error stack:", error.stack)
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
