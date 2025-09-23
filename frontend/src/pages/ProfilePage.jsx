import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, MailCheck } from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import Container from '../components/ui/Container.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

import { useAuthStore } from '../stores/useAuthStore.js';


import { formatDate } from '../utils/format.js';

const ProfilePage = () => {
	const navigate = useNavigate();
	const { user, loading, resendVerification } = useAuthStore();

	if (!user) return null;

	const handleResend = async () => {
		await resendVerification();
		navigate('/verify-email');
	}

return (
    <Container size="md">
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
    </Container>
);
}

export default ProfilePage;


