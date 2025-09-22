import { useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Shield, UserPlus } from "lucide-react";

import { useUserStore } from "../../stores/useUserStore.js";
import AnalyticsCard from "./AnalyticsCard.jsx";
import LoadingSpinner from "../LoadingSpinner.jsx";

const UserStats = () => {
	const { stats, fetchStats, loading } = useUserStore();

	useEffect(() => {
		fetchStats();
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
		<div className="max-w-7xl mx-auto">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
				{statsData.map((stat, index) => (
					<motion.div
						key={stat.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
					>
						<AnalyticsCard
							title={stat.title}
							value={stat.value}
							icon={stat.icon}
							color={stat.color}
						/>
					</motion.div>
				))}
			</div>

			{/* Additional Insights */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Verification Rate */}
				<motion.div
					className="bg-gray-800 rounded-lg p-6 shadow-lg"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
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
							<div 
								className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
								style={{ width: `${verificationRate}%` }}
							/>
						</div>
					</div>
					
					<p className="text-sm text-gray-400">
						{stats.verified} out of {stats.total} users have verified their email addresses
					</p>
				</motion.div>

				{/* Admin Distribution */}
				<motion.div
					className="bg-gray-800 rounded-lg p-6 shadow-lg"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
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
								<div 
									className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
									style={{ width: `${adminRate}%` }}
								/>
							</div>
						</div>
						
						<div>
							<div className="flex items-center justify-between text-sm text-gray-300 mb-2">
								<span>Customer Users</span>
								<span>{(100 - adminRate).toFixed(1)}%</span>
							</div>
							<div className="w-full bg-gray-700 rounded-full h-2">
								<div 
									className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
									style={{ width: `${100 - adminRate}%` }}
								/>
							</div>
						</div>
					</div>
					
					<p className="text-sm text-gray-400 mt-4">
						{stats.admins} admin users and {stats.customers} customer users
					</p>
				</motion.div>
			</div>

			{/* Summary Stats */}
			<motion.div
				className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-lg p-6 mt-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				<div className="text-center">
					<h3 className="text-xl font-semibold text-white mb-2">User Management Summary</h3>
					<p className="text-emerald-100">
						You have {stats.total} total users with {verificationRate}% email verification rate. 
						{stats.unverified > 0 && (
							<span className="block mt-1">
								{stats.unverified} users still need to verify their email addresses.
							</span>
						)}
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default UserStats;
