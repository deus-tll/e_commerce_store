import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		minlength: [6, "Password must be at least 6 characters long"],
		select: false
	},
	role: {
		type: String,
		enum: ["customer", "admin"],
		default: "customer",
	},
	lastLogin: {
		type: Date,
		default: Date.now,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	resetPasswordToken: String,
	resetPasswordTokenExpiresAt: Date,
	verificationToken: String,
	verificationTokenExpiresAt: Date,
},
	{ timestamps: true }
);

/**
 * @type {import('mongoose').Model & import('mongoose').Document}
 */
const User = mongoose.model("User", userSchema);

export default User;