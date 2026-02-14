import {Link} from "react-router-dom";
import {ArrowLeft} from "lucide-react";

import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm.jsx";

import Container from "../../components/ui/Container.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import {useState} from "react";
import Card from "../../components/ui/Card.jsx";

const ForgotPasswordPage = () => {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [submittedEmail, setSubmittedEmail] = useState("");

	const handleSubmissionSuccess = (email) => {
		setSubmittedEmail(email);
		setIsSubmitted(true);
	};

	return (
		<Container size="sm">
			<SectionHeader title="Forgot Password" />

			{!isSubmitted ? (
				<Card className="py-8 px-4 sm:px-10">
					<ForgotPasswordForm onSubmissionSuccess={handleSubmissionSuccess} />
				</Card>
			) : (
				<Card className="py-8 px-4 sm:px-10">
					<div className="text-center">
						<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
							<Mail className="h-8 w-8 text-white" />
						</div>
						<p className="text-gray-300 mb-6">
							If an account exists for
							{<span className="text-lime-500 font-semibold"> {submittedEmail}</span>}
							, you will receive a password reset link shortly.
						</p>
					</div>
				</Card>
			)}

			<p className="mt-8 text-center text-sm text-gray-400">
				<Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
					<ArrowLeft className="inline h-4 w-4" /> Back to Login
				</Link>
			</p>
		</Container>
	);
};

export default ForgotPasswordPage;