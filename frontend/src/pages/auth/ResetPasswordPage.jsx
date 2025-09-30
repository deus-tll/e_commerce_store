import {useState} from "react";
import {Lock} from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";

import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import { Input } from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const ResetPasswordPage = () => {
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: ""
	});

	const { token } = useParams();

    const { loading, resetPassword } = useAuthStore();
    const [errors, setErrors] = useState({});

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

        if (!validate()) return;

        try {
            await resetPassword({ token, ...formData });
            setErrors({ form: "Password reset successfully" });
        }
        catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Reset failed";
            setErrors((prev) => ({ ...prev, form: msg }));
        }
	}

    return (
        <Container size="sm">
            <SectionHeader title="Reset Password" />
            <Card className="py-8 px-4 sm:px-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                {errors.form && (
                    <div className={`p-3 rounded ${errors.form === 'Password reset successfully' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{errors.form}</div>
                )}
                    <FormField label="Password" error={errors.password}>
                        <Input leftIcon={Lock} id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
                    </FormField>
                    <FormField label="Confirm Password" error={errors.confirmPassword}>
                        <Input leftIcon={Lock} id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" />
                    </FormField>
                {(errors.password || errors.confirmPassword) && (
                    <p className="text-sm text-red-400">{errors.password || errors.confirmPassword}</p>
                )}

                    <Button disabled={loading} className="w-full justify-center">Set New Password</Button>
                </form>
            </Card>
        </Container>
	);
};

export default ResetPasswordPage;