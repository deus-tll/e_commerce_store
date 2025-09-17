import {useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import {useUserStore} from "../stores/useUserStore.js";
import {useCartStore} from "../stores/useCartStore.js";

import HomePage from "../pages/HomePage.jsx";
import SignupPage from "../pages/auth/SignupPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import CartPage from "../pages/cart/CartPage.jsx";
import PurchaseSuccessPage from "../pages/cart/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "../pages/cart/PurchaseCancelPage.jsx";
import EmailVerificationPage from "../pages/auth/EmailVerificationPage.jsx";

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
				<Route path="/" element={ <HomePage /> } />

				<Route path="/signup" element={ !user ? <SignupPage /> : <Navigate to='/' /> } />
				<Route path="/login" element={ !user ? <LoginPage /> : <Navigate to='/' /> } />
				<Route path="/verify-email" element={ <EmailVerificationPage /> } />


				<Route path="/admin-dashboard" element={ user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' /> } />

				<Route path="/category/:category" element={ <CategoryPage /> } />
				<Route path="/cart" element={ user ? <CartPage /> : <Navigate to='/' /> } />
				<Route path="/purchase-success" element={ user ? <PurchaseSuccessPage /> : <Navigate to='/' /> } />
				<Route path="/purchase-cancel" element={ user ? <PurchaseCancelPage /> : <Navigate to='/' /> } />
			</Routes>
		</div>
	);
}

export default AppRouter;