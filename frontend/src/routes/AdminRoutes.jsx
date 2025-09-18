import {Route} from "react-router-dom";

import {ProtectedAdminRoute} from "../components/RouteWrappers.jsx";

import AdminPage from "../pages/AdminPage.jsx";

export const AdminRoutes = (
	<>
		<Route path="/admin-dashboard" element={
			<ProtectedAdminRoute>
				<AdminPage />
			</ProtectedAdminRoute>
		} />
	</>
);