import {useSearchParams} from "react-router-dom";

import {ADMIN_TABS} from "../constants/app.js";
import {ADMIN_PAGE_TABS} from "../constants/navigation.jsx";

import ProductsTab from "../components/admin/tabs/ProductsTab.jsx";
import CategoriesTab from "../components/admin/tabs/CategoriesTab.jsx";
import OrdersTab from "../components/admin/tabs/OrdersTab.jsx";
import UsersTab from "../components/admin/tabs/UsersTab.jsx";
import UserStatsTab from "../components/admin/tabs/UserStatsTab.jsx";
import AnalyticsTab from "../components/admin/tabs/AnalyticsTab.jsx";

import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

const AdminPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") || ADMIN_TABS.PRODUCTS;

	const setActiveTab = (tabId) => {
		setSearchParams({ tab: tabId });
	};

	const isTabActive = (tabId) => {
		if (tabId === ADMIN_TABS.USERS) {
			return [ADMIN_TABS.USERS, ADMIN_TABS.USER_STATS].includes(activeTab);
		}
		return activeTab === tabId;
	};

    return (
        <Container size="lg">
            <SectionHeader title="Admin Dashboard" />
            <Card className="p-6 mb-8">
                <div className="flex justify-center flex-wrap gap-3">
	                {ADMIN_PAGE_TABS.map((tab) => {
		                const { icon: Icon } = tab;

		                return (
			                <Button
				                key={tab.id}
				                onClick={() => setActiveTab(tab.id)}
				                variant={isTabActive(tab.id) ? "primary" : "secondary"}
				                className="flex items-center"
			                >
				                <Icon className="mr-2 h-5 w-5" />
				                {tab.label}
			                </Button>
		                );
	                })}
                </div>
            </Card>

            {activeTab === ADMIN_TABS.PRODUCTS && <ProductsTab />}
            {activeTab === ADMIN_TABS.CATEGORIES && <CategoriesTab />}
            {activeTab === ADMIN_TABS.ORDERS && <OrdersTab />}

	        {(activeTab === ADMIN_TABS.USERS || activeTab === ADMIN_TABS.USER_STATS) && (
		        <div className="space-y-6">
			        <div className="flex items-center gap-2">
				        <Button
					        variant={activeTab === ADMIN_TABS.USERS ? "primary" : "secondary"}
					        onClick={() => setActiveTab(ADMIN_TABS.USERS)}
				        >
					        Manage
				        </Button>
				        <Button
					        variant={activeTab === ADMIN_TABS.USER_STATS ? "primary" : "secondary"}
					        onClick={() => setActiveTab(ADMIN_TABS.USER_STATS)}
				        >
					        Stats
				        </Button>
			        </div>

			        {activeTab === ADMIN_TABS.USERS ? <UsersTab /> : <UserStatsTab />}
		        </div>
	        )}

            {activeTab === ADMIN_TABS.ANALYTICS && <AnalyticsTab />}
        </Container>
    );
};

export default AdminPage;