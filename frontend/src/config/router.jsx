import {useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import {useUserStore} from "../stores/useUserStore.js";

import HomePage from "../pages/HomePage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";


const AppRouter = () => {
	const { user, checkAuth, checkingAuth } = useUserStore();

	useEffect(() => {
		checkAuth();

	}, [checkAuth]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<Routes>
			<Route path="/" element={ <HomePage /> } />
			<Route path="/signup" element={ !user ? <SignupPage /> : <Navigate to='/' /> } />
			<Route path="/login" element={ !user ? <LoginPage /> : <Navigate to='/' /> } />
		</Routes>
	);
}

export default AppRouter;