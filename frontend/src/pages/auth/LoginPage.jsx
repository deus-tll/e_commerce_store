import {Link} from "react-router-dom";
import {ArrowRight} from "lucide-react";

import LoginForm from "../../components/auth/LoginForm.jsx";

import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const LoginPage = () => {
	return (
		<Container size="sm">
			<SectionHeader title="Login to your account" />
			<Card className="py-8 px-4 sm:px-10">
				<LoginForm />

				<p className="mt-8 text-center text-sm text-gray-400">
					Don't have an account?{" "}
					<Link to="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
						Sign up here <ArrowRight className="inline h-4 w-4" />
					</Link>
				</p>
			</Card>
		</Container>
	);
};

export default LoginPage;