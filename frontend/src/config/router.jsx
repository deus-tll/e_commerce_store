import {useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import {useUserStore} from "../stores/useUserStore.js";
import {useCartStore} from "../stores/useCartStore.js";

import {ProtectedAdminRoute, ProtectedRoute, RedirectAuthenticatedUser} from "../components/RouteWrappers.jsx";

import LoadingSpinner from "../components/LoadingSpinner.jsx";

import HomePage from "../pages/HomePage.jsx";
import SignupPage from "../pages/auth/SignupPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import CartPage from "../pages/cart/CartPage.jsx";
import PurchaseSuccessPage from "../pages/cart/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "../pages/cart/PurchaseCancelPage.jsx";
import EmailVerificationPage from "../pages/auth/EmailVerificationPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";

const AppRouter = () => {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;
		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<div className="pt-10">
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={ <HomePage /> } />
				<Route path="/category/:category" element={ <CategoryPage /> } />

				{/* Auth Routes */}
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
				<Route path="/verify-email" element={
					user && !user.isVerified
						? <EmailVerificationPage />
						: <Navigate to='/' />
				} />

				{/* Admin Routes */}
				<Route path="/admin-dashboard" element={
					<ProtectedAdminRoute>
						<AdminPage />
					</ProtectedAdminRoute>
				} />

				{/* Protected Routes */}
				<Route path="/profile" element={
					<ProtectedRoute>
						<ProfilePage />
					</ProtectedRoute>
				} />
				<Route path="/cart" element={
					<ProtectedRoute>
						<CartPage />
					</ProtectedRoute>
				} />
				<Route path="/purchase-success" element={
					<ProtectedRoute>
						<PurchaseSuccessPage />
					</ProtectedRoute>
				} />
				<Route path="/purchase-cancel" element={
					<ProtectedRoute>
						<PurchaseCancelPage />
					</ProtectedRoute>
				} />
			</Routes>
		</div>
	);
}

export default AppRouter;