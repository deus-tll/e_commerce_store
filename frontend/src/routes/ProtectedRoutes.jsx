import {Route} from "react-router-dom";

import {ProtectedRoute} from "../components/general/RouteWrappers.jsx";

import ProfilePage from "../pages/ProfilePage.jsx";
import CartPage from "../pages/cart/CartPage.jsx";
import PurchaseSuccessPage from "../pages/cart/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "../pages/cart/PurchaseCancelPage.jsx";

export const ProtectedRoutes = (
	<>
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
	</>
);