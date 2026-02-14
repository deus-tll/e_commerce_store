import {Link} from "react-router-dom";
import {ArrowRight} from "lucide-react";

import SignupForm from "../../components/auth/SignupForm.jsx";

import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const SignupPage = () => {
	return (
		<Container size="sm">
			<SectionHeader title="Create your account" />
			<Card className="py-8 px-4 sm:px-10">
				<SignupForm />

				<p className="mt-8 text-center text-sm text-gray-400">
					Already have an account?{" "}
					<Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
						Login here <ArrowRight className="inline h-4 w-4" />
					</Link>
				</p>
			</Card>
		</Container>
	);
};

export default SignupPage;