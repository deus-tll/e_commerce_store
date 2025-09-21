import {useEffect, useState} from "react";
import {PlusCircle, ShoppingBasket, BarChart, Users, UserCog} from "lucide-react";
import { motion } from "framer-motion";

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
		<div className="relative overflow-hidden">
			<div className="relative z-10 container mx-auto px-4 pt-16 pb-10">
				<motion.h1
					className="text-4xl font-bold mb-8 text-emerald-400 text-center"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				<div className="flex justify-center mb-8">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							<tab.icon className="mr-2 h-5 w-5" />
							{tab.label}
						</button>
					))}
				</div>

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
			</div>
		</div>
	);
};

export default AdminPage;