import {Routes, Route} from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";


const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={ <HomePage /> } />
			<Route path="/signup" element={ <SignupPage /> } />
			<Route path="/login" element={ <LoginPage /> } />
		</Routes>
	);
}

export default AppRouter;