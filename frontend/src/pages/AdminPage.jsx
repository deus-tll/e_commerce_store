import {useEffect, useState} from "react";
import {PlusCircle, ShoppingBasket, BarChart, Users, UserCog} from "lucide-react";
import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

import {useProductStore} from "../stores/useProductStore.js";

import CreateProductForm from "../components/admin/CreateProductForm.jsx";
import CreateCategoryForm from "../components/admin/CreateCategoryForm.jsx";
import CategoriesList from "../components/admin/CategoriesList.jsx";
import ProductsList from "../components/admin/ProductsList.jsx";
import AnalyticsTab from "../components/admin/AnalyticsTab.jsx";
import UsersList from "../components/admin/UsersList.jsx";
import UserStats from "../components/admin/UserStats.jsx";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "categories", label: "Create Category", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "users", label: "Users", icon: Users },
	{ id: "user-stats", label: "User Stats", icon: UserCog },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];


const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");

	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

    return (
        <Container size="lg">
            <SectionHeader title="Admin Dashboard" />
            <Card className="p-6 mb-8 bg-transparent">
                <div className="flex justify-center flex-wrap gap-3">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            variant={activeTab === tab.id ? "primary" : "secondary"}
                            className="flex items-center"
                        >
                            <tab.icon className="mr-2 h-5 w-5" />
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </Card>

            {activeTab === "create" && <CreateProductForm />}
            {activeTab === "categories" && (
                <div>
                    <CreateCategoryForm />
                    <CategoriesList />
                </div>
            )}
            {activeTab === "products" && <ProductsList />}
            {activeTab === "users" && <UsersList />}
            {activeTab === "user-stats" && <UserStats />}
            {activeTab === "analytics" && <AnalyticsTab />}
        </Container>
    );
};

export default AdminPage;