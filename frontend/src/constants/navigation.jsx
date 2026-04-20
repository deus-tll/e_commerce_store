import { PlusCircle, ShoppingBasket, BarChart, Users, ClipboardCheck, User, ShoppingBag } from "lucide-react";
import { ADMIN_TABS, PROFILE_TABS } from "./app.js";

export const ADMIN_PAGE_TABS = [
    { id: ADMIN_TABS.PRODUCTS, label: "Products", icon: ShoppingBasket },
    { id: ADMIN_TABS.CATEGORIES, label: "Categories", icon: PlusCircle },
    { id: ADMIN_TABS.ORDERS, label: "Orders", icon: ClipboardCheck },
    { id: ADMIN_TABS.USERS, label: "Users", icon: Users },
    { id: ADMIN_TABS.ANALYTICS, label: "Analytics", icon: BarChart },
];

export const PROFILE_PAGE_TABS = [
    { id: PROFILE_TABS.ACCOUNT, label: "Account Settings", icon: User },
    { id: PROFILE_TABS.MY_ORDERS, label: "My Orders", icon: ShoppingBag }
];