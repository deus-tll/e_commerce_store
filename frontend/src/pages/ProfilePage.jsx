import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, MailCheck } from 'lucide-react';

import { useUserStore } from '../stores/useUserStore.js';

import SubmitButton from '../components/SubmitButton.jsx';

const formatDate = (dateString) => {
	if (!dateString) return '—';
	const d = new Date(dateString);
	return d.toLocaleString();
}

const ProfilePage = () => {
	const navigate = useNavigate();
	const { user, loading, resendVerification } = useUserStore();

	if (!user) return null;

	const handleResend = async () => {
		await resendVerification();
		navigate('/verify-email');
	}

	return (
		<div className="max-w-3xl mx-auto px-4 py-12">
			<motion.div
				className="bg-gray-900 border border-emerald-800 rounded-xl shadow-xl p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
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
						<p className="text-white text-lg font-medium">
							{new Date(user.createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
					</div>

					<div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
						<p className="text-gray-400 text-sm">Last Login</p>
						<p className="text-white text-lg font-medium">{formatDate(user.lastLogin)}</p>
					</div>

					<div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
						<div className="flex items-center">
							<p className="text-gray-400 text-sm mr-3">Verification Status</p>
							{user.isVerified ? (
								<>
									<CheckCircle2 className="text-emerald-400 mr-2" />
									<span className="text-emerald-400 font-medium">Verified</span>
								</>
							) : (
								<>
									<XCircle className="text-red-400 mr-2" />
									<span className="text-red-400 font-medium">Not Verified</span>
								</>
							)}
						</div>

						{!user.isVerified && (
							<div className="max-w-[10rem] w-full">
								<SubmitButton
									loading={loading}
									text="Send Code"
									icon={MailCheck}
									type="button"
									onClick={handleResend}
								/>
							</div>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export default ProfilePage;


