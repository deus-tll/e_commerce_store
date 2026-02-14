import {Route} from "react-router-dom";

import {RedirectAuthenticatedUser} from "../components/general/RouteWrappers.jsx";

import SignupPage from "../pages/auth/SignupPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";

export const AuthRoutes = (
	<>
		<Route path="/signup" element={
			<RedirectAuthenticatedUser>
				<SignupPage />
			</RedirectAuthenticatedUser>
		} />
		<Route path="/login" element={
			<RedirectAuthenticatedUser>
				<LoginPage />
			</RedirectAuthenticatedUser>
		} />
		<Route path="/forgot-password" element={
			<RedirectAuthenticatedUser>
				<ForgotPasswordPage />
			</RedirectAuthenticatedUser>
		} />
		<Route path="/reset-password/:token" element={
			<RedirectAuthenticatedUser>
				<ResetPasswordPage />
			</RedirectAuthenticatedUser>
		} />
	</>
);