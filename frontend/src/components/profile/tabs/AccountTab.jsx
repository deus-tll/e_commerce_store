import {useNavigate} from "react-router-dom";
import {CheckCircle2, MailCheck, XCircle} from "lucide-react";
import {toast} from "react-hot-toast";

import {useAuthStore} from "../../../stores/useAuthStore.js";
import {formatDate} from "../../../utils/format.js";

import ChangePasswordForm from "../../auth/ChangePasswordForm.jsx";

import Card from "../../ui/Card.jsx";
import Badge from "../../ui/Badge.jsx";
import Button from "../../ui/Button.jsx";

const AccountTab = () => {
	const navigate = useNavigate();
	const { user, loading, resendVerification } = useAuthStore();

	const handleResend = async () => {
		try {
			await resendVerification();
			toast.success("Verification code sent! Please check your email.");
			navigate('/verify-email');
		}
			// eslint-disable-next-line no-unused-vars
		catch (error) { /* empty */ }
	}

	return (
		<div>
			<Card className="p-6">
				<h1 className="text-2xl font-bold text-emerald-400 mb-6">Your Profile</h1>

				<div className="space-y-4">
					<div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
						<p className="text-gray-400 text-sm">Name</p>
						<p className="text-white text-lg font-medium">{user.name}</p>
					</div>

					<div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
						<p className="text-gray-400 text-sm">Email</p>
						<p className="text-white text-lg font-medium break-all">{user.email}</p>
					</div>

					<div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
						<p className="text-gray-400 text-sm">Joined</p>
						<p className="text-white text-lg font-medium">{formatDate(user.createdAt)}</p>
					</div>

					<div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
						<p className="text-gray-400 text-sm">Last Login</p>
						<p className="text-white text-lg font-medium">{formatDate(user.lastLogin)}</p>
					</div>

					<div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
						<div className="flex items-center">
							<p className="text-gray-400 text-sm mr-3">Verification Status</p>
							{user.isVerified ? (
								<Badge color="green" leftIcon={CheckCircle2}>Verified</Badge>
							) : (
								<Badge color="red" leftIcon={XCircle}>Not Verified</Badge>
							)}
						</div>

						{!user.isVerified && (
							<div className="max-w-[10rem] w-full">
								<Button onClick={handleResend} className="w-full justify-center" disabled={loading}>
									<MailCheck className="h-4 w-4" />
									Send Code
								</Button>
							</div>
						)}
					</div>
				</div>
			</Card>

			<Card className="p-6 mt-6">
				<ChangePasswordForm />
			</Card>
		</div>
	);
};

export default AccountTab;