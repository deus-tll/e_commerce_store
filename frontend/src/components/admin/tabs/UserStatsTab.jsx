import { useEffect } from "react";
import {Users, UserCheck, UserX, Shield, UserPlus} from "lucide-react";

import {useUserStore} from "../../../stores/useUserStore.js";

import AnalyticsCard from "../AnalyticsCard.jsx";
import LoadingSpinner from "../../ui/LoadingSpinner.jsx";
import Container from "../../ui/Container.jsx";
import Card from "../../ui/Card.jsx";

const UserStatsTab = () => {
	const { stats, loading, fetchStats } = useUserStore();

	useEffect(() => {
		void fetchStats();
	}, [fetchStats]);

	if (loading && !stats) {
		return <LoadingSpinner />;
	}

	if (!stats) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-400">No user statistics available</p>
			</div>
		);
	}

	const statsData = [
		{
			title: "Total Users",
			value: stats.total.toLocaleString(),
			icon: Users,
			color: "from-emerald-500 to-teal-700",
			description: "All registered users"
		},
		{
			title: "Verified Users",
			value: stats.verified.toLocaleString(),
			icon: UserCheck,
			color: "from-green-500 to-emerald-700",
			description: "Users with verified emails"
		},
		{
			title: "Unverified Users",
			value: stats.unverified.toLocaleString(),
			icon: UserX,
			color: "from-red-500 to-rose-700",
			description: "Users pending verification"
		},
		{
			title: "Admin Users",
			value: stats.admins.toLocaleString(),
			icon: Shield,
			color: "from-purple-500 to-violet-700",
			description: "Administrator accounts"
		},
		{
			title: "Customer Users",
			value: stats.customers.toLocaleString(),
			icon: UserPlus,
			color: "from-blue-500 to-cyan-700",
			description: "Regular customer accounts"
		}
	];

	const verificationRate = stats.total > 0
		? ((stats.verified / stats.total) * 100).toFixed(1)
		: 0;

	const adminRate = stats.total > 0
		? ((stats.admins / stats.total) * 100).toFixed(1)
		: 0;

    return (
        <Container size="lg">
			{/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                {statsData.map((stat) => (
                    <AnalyticsCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </div>

			{/* Additional Insights */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Verification Rate */}
                <div className="col-span-2">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Email Verification Rate</h3>
                            <UserCheck className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                                <span>Verification Rate</span>
                                <span>{verificationRate}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${verificationRate}%` }} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">{stats.verified} out of {stats.total} users have verified their email addresses</p>
                    </Card>
                </div>

				{/* Admin Distribution */}
                <div className="col-span-2">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">User Role Distribution</h3>
                            <Shield className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                                    <span>Admin Users</span>
                                    <span>{adminRate}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${adminRate}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                                    <span>Customer Users</span>
                                    <span>{(100 - adminRate).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${100 - adminRate}%` }} />
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">{stats.admins} admin users and {stats.customers} customer users</p>
                    </Card>
                </div>
            </div>
        </Container>
	);
};

export default UserStatsTab;