import {useEffect, useState} from "react";
import {PlusCircle, ShoppingBasket, BarChart, Users} from "lucide-react";
import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

import {useProductStore} from "../stores/useProductStore.js";

import CreateCategoryForm from "../components/admin/CreateCategoryForm.jsx";
import CategoriesList from "../components/admin/CategoriesList.jsx";
import ProductsList from "../components/admin/ProductsList.jsx";
import AnalyticsTab from "../components/admin/AnalyticsTab.jsx";
import UsersList from "../components/admin/UsersList.jsx";
import UserStats from "../components/admin/UserStats.jsx";
import Modal from "../components/ui/Modal.jsx";
import CreateProductForm from "../components/admin/CreateProductForm.jsx";

const tabs = [
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "categories", label: "Categories", icon: PlusCircle },
	{ id: "users", label: "Users", icon: Users },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("products");
    const [showCreateProduct, setShowCreateProduct] = useState(false);
    const [showCreateCategory, setShowCreateCategory] = useState(false);

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

            {activeTab === "products" && (
                <div className="space-y-4">
                    <ProductsList onCreate={() => setShowCreateProduct(true)} />
                </div>
            )}

            {activeTab === "categories" && (
                <div className="space-y-4">
                    <CategoriesList onCreate={() => setShowCreateCategory(true)} />
                </div>
            )}

            {activeTab === "users" && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Button variant="primary">Manage</Button>
                        <Button variant="secondary" onClick={() => setActiveTab("users:stats")}>Stats</Button>
                    </div>
                    <UsersList />
                </div>
            )}

            {activeTab === "users:stats" && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => setActiveTab("users")}>Manage</Button>
                        <Button variant="primary">Stats</Button>
                    </div>
                    <UserStats />
                </div>
            )}

            {activeTab === "analytics" && <AnalyticsTab />}

            <Modal
	            title="Create Product"
	            open={showCreateProduct}
	            onClose={() => setShowCreateProduct(false)}
	            maxWidth="max-w-xl"
            >
                {showCreateProduct && <CreateProductForm />}
            </Modal>

            <Modal
	            title="Create Category"
	            open={showCreateCategory}
	            onClose={() => setShowCreateCategory(false)}
	            maxWidth="max-w-xl"
            >
                {showCreateCategory && <CreateCategoryForm />}
            </Modal>
        </Container>
    );
};

export default AdminPage;