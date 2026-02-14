import {useEffect} from 'react';
import {Users, Package, ShoppingCart, DollarSign} from "lucide-react";

import {useAnalyticsStore} from "../../../stores/useAnalyticsStore.js";

import {formatCurrency} from "../../../utils/format.js";

import SalesChart from "../SalesChart.jsx";
import AnalyticsCard from "../AnalyticsCard.jsx";

import LoadingSpinner from "../../ui/LoadingSpinner.jsx";
import Container from "../../ui/Container.jsx";
import SectionHeader from "../../ui/SectionHeader.jsx";


const AnalyticsTab = () => {
	const { analyticsData, dailySalesData, loading, fetchAnalytics } = useAnalyticsStore();

	useEffect(() => {
		void fetchAnalytics();
	}, [fetchAnalytics]);

	if (loading && !analyticsData.totalSales) return <LoadingSpinner />;

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

	        <SalesChart data={dailySalesData} />
        </Container>
	);
};

export default AnalyticsTab;