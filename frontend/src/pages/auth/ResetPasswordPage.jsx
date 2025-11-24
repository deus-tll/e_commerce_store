import ResetPasswordForm from "../../components/auth/ResetPasswordForm.jsx";

import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const ResetPasswordPage = () => {
	return (
		<Container size="sm">
			<SectionHeader title="Reset Password" />
			<Card className="py-8 px-4 sm:px-10">
				<ResetPasswordForm />
			</Card>
		</Container>
	);
};

export default ResetPasswordPage;