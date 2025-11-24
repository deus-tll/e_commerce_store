import React from 'react';
import EmailVerificationForm from "../../components/auth/EmailVerificationForm.jsx";

import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const EmailVerificationPage = () => {
	return (
		<Container size="sm">
			<SectionHeader title="Verify Your Email" />
			<Card className="py-8 px-4 sm:px-10">
				<EmailVerificationForm />
			</Card>
		</Container>
	);
};

export default EmailVerificationPage;