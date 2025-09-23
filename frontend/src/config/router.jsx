import {useEffect} from "react";
import {Routes, Route, Navigate, useLocation} from "react-router-dom";

import {useAuthStore} from "../stores/useAuthStore.js";
import {useCartStore} from "../stores/useCartStore.js";

import LoadingSpinner from "../components/LoadingSpinner.jsx";

import EmailVerificationPage from "../pages/auth/EmailVerificationPage.jsx";

import {PublicRoutes} from "../routes/PublicRoutes.jsx";
import {AuthRoutes} from "../routes/AuthRoutes.jsx";
import {AdminRoutes} from "../routes/AdminRoutes.jsx";
import {ProtectedRoutes} from "../routes/ProtectedRoutes.jsx";

const AppRouter = () => {
	const { user, checkAuth, checkingAuth } = useAuthStore();
	const { getCartItems } = useCartStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;
		getCartItems();
	}, [getCartItems, user]);

    const location = useLocation();

    if (checkingAuth) return <LoadingSpinner />;

    return (
        <div className="pt-16">
                <Routes location={location}>
			        {PublicRoutes}
			        {AuthRoutes}
			        {AdminRoutes}
			        {ProtectedRoutes}

			        <Route path="/verify-email" element={
				        user && !user.isVerified
					        ? <EmailVerificationPage />
					        : <Navigate to='/' />
			        } />
                </Routes>
        </div>
    );
}

export default AppRouter;