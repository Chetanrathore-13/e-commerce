const mongoose = require("mongoose")
require("dotenv").config()
// Load environment variables from .env file

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Define the PaymentSetting schema
const PaymentSettingSchema = new mongoose.Schema(
  {
    cod_enabled: { type: Boolean, default: true },
    cod_min_order_value: { type: Number, default: 0 },
    cod_max_order_value: { type: Number, default: 10000 },
    online_payment_enabled: { type: Boolean, default: true },
    paypal_enabled: { type: Boolean, default: true },
    bank_transfer_enabled: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Create the model
const PaymentSetting = mongoose.models.PaymentSetting || mongoose.model("PaymentSetting", PaymentSettingSchema)

async function seedPaymentSettings() {
  try {
    // Check if payment settings already exist
    const existingSettings = await PaymentSetting.findOne({})

    if (existingSettings) {
      console.log("Payment settings already exist. Updating...")

      existingSettings.cod_enabled = true
      existingSettings.cod_min_order_value = 0
      existingSettings.cod_max_order_value = 10000
      existingSettings.online_payment_enabled = true
      existingSettings.paypal_enabled = true
      existingSettings.bank_transfer_enabled = true

      await existingSettings.save()
      console.log("Payment settings updated successfully!")
    } else {
      // Create new payment settings
      const paymentSettings = new PaymentSetting({
        cod_enabled: true,
        cod_min_order_value: 0,
        cod_max_order_value: 10000,
        online_payment_enabled: true,
        paypal_enabled: true,
        bank_transfer_enabled: true,
      })

      await paymentSettings.save()
      console.log("Payment settings created successfully!")
    }

    // Display the current settings
    const settings = await PaymentSetting.findOne({})
    console.log("Current Payment Settings:")
    console.log(JSON.stringify(settings, null, 2))
  } catch (error) {
    console.error("Error seeding payment settings:", error)
  } finally {
    mongoose.disconnect()
    console.log("Database connection closed")
  }
}

seedPaymentSettings()
