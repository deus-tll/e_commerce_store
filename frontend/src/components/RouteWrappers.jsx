import {Navigate} from "react-router-dom";
import {useUserStore} from "../stores/useUserStore.js";

export const RedirectAuthenticatedUser = ({children}) => {
	const { user } = useUserStore();

	if (user) {
		return <Navigate to="/" replace />;
	}

	return children;
}

export const ProtectedAdminRoute = ({children}) => {
	const { user } = useUserStore();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (user.role === "admin") {
		return children;
	}

	return <Navigate to="/" replace />;
}

export const ProtectedRoute = ({children}) => {
	const { user } = useUserStore();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children;
}