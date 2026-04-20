import {useSearchParams} from 'react-router-dom';

import {useAuthStore} from '../stores/useAuthStore.js';

import {PROFILE_TABS} from "../constants/app.js";
import {PROFILE_PAGE_TABS} from "../constants/navigation.jsx";

import AccountTab from "../components/profile/tabs/AccountTab.jsx";
import MyOrdersTab from "../components/profile/tabs/MyOrdersTab.jsx";

import Container from '../components/ui/Container.jsx';
import Button from "../components/ui/Button.jsx";

const ProfilePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") || PROFILE_TABS.ACCOUNT;

	const setActiveTab = (tabId) => {
		setSearchParams({ tab: tabId });
	};
	const { user } = useAuthStore();

	if (!user) return null;

	return (
		<Container size="lg">
			<div className="flex flex-col lg:flex-row gap-8">
				{/* Sidebar Navigation */}
				<div className="w-full lg:w-64 flex-shrink-0">
					<div className="flex lg:flex-col gap-2 p-1 bg-gray-900/50 rounded-xl border border-gray-800">
						{PROFILE_PAGE_TABS.map((tab) => {
							const { icon: Icon } = tab;
							const isActive = activeTab === tab.id;

							return (
								<Button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									variant={isActive ? "primary" : "secondary"}
									className="flex items-center"
								>
									<Icon className="mr-2 h-5 w-5" />
									{tab.label}
								</Button>
							);
						})}
					</div>
				</div>

				{/* Content Area */}
				<div className="flex-1">
					{activeTab === PROFILE_TABS.ACCOUNT && <AccountTab/>}
					{activeTab === PROFILE_TABS.MY_ORDERS && <MyOrdersTab/>}
				</div>
			</div>


		</Container>
	);
};

export default ProfilePage;