import {useState} from 'react';
import {Link} from "react-router-dom";
import {ArrowLeft, Mail} from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";
import {getErrorMessage} from "../../utils/errorParser.js";

import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import {Input} from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import ErrorMessage from "../../components/ui/ErrorMessage.jsx";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { loading, forgotPassword } = useAuthStore();

    const handleSubmit = async (e) => {
		e.preventDefault();
	    setError("");

		try {
			await forgotPassword(email);
			setIsSubmitted(true);
		}
        catch (err) {
	        const msg = getErrorMessage(err, "Could not send reset link. Please try again.");
	        setError(msg);
		}
	}

    return (
        <Container size="sm">
            <SectionHeader title="Forgot Password" />
			{!isSubmitted ? (
                <Card className="py-8 px-4 sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
	                    <ErrorMessage message={error} />

                        <p className='text-center text-gray-300 mb-6'>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <FormField label="Email address" error={error}>
                            <Input leftIcon={Mail} id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                        </FormField>

                        <Button disabled={loading} className="w-full justify-center">Send Reset Link</Button>
                    </form>
                </Card>
			) : (
                <Card className="py-8 px-4 sm:px-10">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-gray-300 mb-6">
                            If an account exists for
                            {<span className="text-lime-500 font-semibold"> {email}</span>}
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