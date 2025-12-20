import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, default: 'admin@gmail.com' },
    password: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;