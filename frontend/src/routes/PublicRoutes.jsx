import {Route} from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";

export const PublicRoutes = (
	<>
		<Route path="/" element={ <HomePage /> } />
		<Route path="/category/:category" element={ <CategoryPage /> } />
	</>
);