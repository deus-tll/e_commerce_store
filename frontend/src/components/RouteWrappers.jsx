import {Navigate} from "react-router-dom";
import {useAuthStore} from "../stores/useAuthStore.js";

export const RedirectAuthenticatedUser = ({children}) => {
	const { user } = useAuthStore();

	if (user) {
		return <Navigate to="/" replace />;
	}

	return children;
}

export const ProtectedAdminRoute = ({children}) => {
	const { user } = useAuthStore();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (user.role === "admin") {
		return children;
	}

	return <Navigate to="/" replace />;
}

export const ProtectedRoute = ({children}) => {
	const { user } = useAuthStore();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children;
}