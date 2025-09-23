import {useEffect} from 'react';
import Container from "../ui/Container.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Card from "../ui/Card.jsx";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import {useAnalyticsStore} from "../../stores/useAnalyticsStore.js";
import { formatCurrency } from "../../utils/format.js";

import AnalyticsCard from "./AnalyticsCard.jsx";
import LoadingSpinner from "../LoadingSpinner.jsx";

const AnalyticsTab = () => {
	const { analyticsData, dailySalesData, loading, error, fetchAnalytics } = useAnalyticsStore();

	useEffect(() => {
		fetchAnalytics();
	}, [fetchAnalytics]);

	if (loading) return <LoadingSpinner />;

	if (error) {
		return <div>Error: {error}</div>;
	}

    return (
        <Container size="lg">
            <SectionHeader title="Analytics" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<AnalyticsCard
					title="Total Users"
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color="from-emerald-500 to-teal-700"
				/>
				<AnalyticsCard
					title="Total Products"
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color="from-emerald-500 to-green-700"
				/>
				<AnalyticsCard
					title="Total Sales"
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color="from-emerald-500 to-cyan-700"
				/>
				<AnalyticsCard
					title='Total Revenue'
                    value={formatCurrency(analyticsData.totalRevenue)}
					icon={DollarSign}
					color="from-emerald-500 to-lime-700"
				/>
			</div>

            <Card className="p-6">
				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" stroke="#D1D5DB" />
						<YAxis yAxisId="left" stroke="#D1D5DB" />
						<YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
						<Tooltip />
						<Legend />
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="sales"
							stroke="#10B981"
							activeDot={{ r: 8 }}
							name="Sales"
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="revenue"
							stroke="#3B82F6"
							activeDot={{ r: 8 }}
							name="Revenue"
						/>
					</LineChart>
				</ResponsiveContainer>
            </Card>
        </Container>
	);
};

export default AnalyticsTab;