import {Request} from "express";
import {UserCreateInput} from "../../application/types/user.js";

// ACCOUNT WORKFLOWS
// ====================================================================

export interface SignupRequest extends Request {
    body: Omit<UserCreateInput, "role" | "isVerified">
}

export interface VerifyEmailRequest extends Request {
    body: {
        code: string;
    }
}

export interface ForgotPasswordRequest extends Request {
    body: {
        email: string;
    }
}

export interface ResetPasswordRequest extends Request {
    params: {
        token: string
    },
    body: {
        password: string;
    }
}

export interface ChangePasswordRequest extends Request {
    body: {
        currentPassword: string;
        newPassword: string;
    }
}

// SESSION WORKFLOWS
// ====================================================================

export interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    }
}