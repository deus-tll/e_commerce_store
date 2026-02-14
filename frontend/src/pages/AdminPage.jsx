import {useSearchParams} from "react-router-dom";
import {PlusCircle, ShoppingBasket, BarChart, Users} from "lucide-react";

import {AdminTabs} from "../constants/app.js";

import CategoriesTab from "../components/admin/tabs/CategoriesTab.jsx";
import AnalyticsTab from "../components/admin/tabs/AnalyticsTab.jsx";
import ProductsTab from "../components/admin/tabs/ProductsTab.jsx";
import UsersTab from "../components/admin/tabs/UsersTab.jsx";
import UserStatsTab from "../components/admin/tabs/UserStatsTab.jsx";

import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

const tabs = [
	{ id: AdminTabs.PRODUCTS, label: "Products", icon: ShoppingBasket },
	{ id: AdminTabs.CATEGORIES, label: "Categories", icon: PlusCircle },
	{ id: AdminTabs.USERS, label: "Users", icon: Users },
	{ id: AdminTabs.ANALYTICS, label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") || AdminTabs.PRODUCTS;

	const setActiveTab = (tabId) => {
		setSearchParams({ tab: tabId });
	};

	const isTabActive = (tabId) => {
		if (tabId === AdminTabs.USERS) {
			return [AdminTabs.USERS, AdminTabs.USER_STATS].includes(activeTab);
		}
		return activeTab === tabId;
	};

    return (
        <Container size="lg">
            <SectionHeader title="Admin Dashboard" />
            <Card className="p-6 mb-8">
                <div className="flex justify-center flex-wrap gap-3">
	                {tabs.map((tab) => {
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

            {activeTab === AdminTabs.PRODUCTS && <ProductsTab />}
            {activeTab === AdminTabs.CATEGORIES && <CategoriesTab />}

	        {(activeTab === AdminTabs.USERS || activeTab === AdminTabs.USER_STATS) && (
		        <div className="space-y-6">
			        <div className="flex items-center gap-2">
				        <Button
					        variant={activeTab === AdminTabs.USERS ? "primary" : "secondary"}
					        onClick={() => setActiveTab(AdminTabs.USERS)}
				        >
					        Manage
				        </Button>
				        <Button
					        variant={activeTab === AdminTabs.USER_STATS ? "primary" : "secondary"}
					        onClick={() => setActiveTab(AdminTabs.USER_STATS)}
				        >
					        Stats
				        </Button>
			        </div>

			        {activeTab === AdminTabs.USERS ? <UsersTab /> : <UserStatsTab />}
		        </div>
	        )}

            {activeTab === AdminTabs.ANALYTICS && <AnalyticsTab />}
        </Container>
    );
};

export default AdminPage;