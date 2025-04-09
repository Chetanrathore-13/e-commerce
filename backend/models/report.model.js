import mongoose from "mongoose";

const ReportsSchema = new mongoose.Schema({
    report_type: { type: String, enum: ['Sales', 'Revenue', 'Customer Growth'] },
    generated_at: String,
    data: mongoose.Schema.Types.Mixed,
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },{ timestamps: true });


export default mongoose.model("Report", ReportsSchema)