import { Schema, model, InferSchemaType, Types } from "mongoose";
import {UserRole, UserRoleValues} from "../../../../../enums/application.js";

const userSchema = new Schema({
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
		enum: UserRoleValues,
		default: UserRole.CUSTOMER,
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
}, {
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

export type IUserDoc = InferSchemaType<typeof userSchema> & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
};

const User = model("User", userSchema);

export default User;