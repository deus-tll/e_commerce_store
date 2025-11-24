import {useState} from "react";
import {useParams} from "react-router-dom";
import {Lock} from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";
import {getErrorMessage} from "../../utils/errorParser.js";

import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import {Input} from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import ErrorMessage from "../../components/ui/ErrorMessage.jsx";

const ResetPasswordPage = () => {
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: ""
	});
	const [successMessage, setSuccessMessage] = useState(null);
	const [errors, setErrors] = useState({});

	const { token } = useParams();

    const { loading, resetPassword } = useAuthStore();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

    const validate = () => {
        const next = {};
        if (!formData.password.trim()) next.password = "Password is required";
        if (formData.password !== formData.confirmPassword) next.confirmPassword = "Passwords don't match";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
		e.preventDefault();

	    setErrors({});
	    setSuccessMessage(null);

        if (!validate()) return;

        try {
            await resetPassword({ token, ...formData });
	        setSuccessMessage("Password reset successfully");
        }
        catch (err) {
	        const msg = getErrorMessage(err, "Password reset failed. Please check the link or try again.");
	        setErrors((prev) => ({ ...prev, form: msg }));
        }
	}

    return (
        <Container size="sm">
            <SectionHeader title="Reset Password" />
            <Card className="py-8 px-4 sm:px-10">
                <form onSubmit={handleSubmit} className="space-y-6">
	                {/* 1. Display Success Message (Green Box) */}
	                {successMessage && (
		                <div className="p-3 rounded bg-green-600 text-white">
			                <div className='flex items-center space-x-2'>
				                <Lock className="h-4 w-4 flex-shrink-0" />
				                <span className='font-medium'>{successMessage}</span>
			                </div>
		                </div>
	                )}

	                {/* 2. Display Error Message (Red Box) */}
	                <ErrorMessage message={errors.form} />


	                {/* Hide inputs after success */}
	                {!successMessage && (
		                <>
			                <FormField label="Password" error={errors.password}>
				                <Input leftIcon={Lock} id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
			                </FormField>
			                <FormField label="Confirm Password" error={errors.confirmPassword}>
				                <Input leftIcon={Lock} id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" />
			                </FormField>
		                </>
	                )}

	                {!successMessage && (
		                <Button disabled={loading} className="w-full justify-center">Set New Password</Button>
	                )}
                </form>
            </Card>
        </Container>
	);
};

export default ResetPasswordPage;