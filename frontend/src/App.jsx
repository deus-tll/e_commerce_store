import {Toaster} from "react-hot-toast";

import AppRouter from "./config/router.jsx";
import Navbar from "./components/Navbar.jsx";
import GlobalErrorDisplay from "./components/GlobalErrorDisplay.jsx";
import BackgroundGradient from "./components/BackgroundGradient.jsx";

function App() {
	return (
        <div className="min-h-screen bg-gray-900 text-white relative, overflow-hidden">
	        <BackgroundGradient />
	        <div className="relative z-50">
		        <Navbar />
		        <GlobalErrorDisplay />
		        <AppRouter />
	        </div>
	        <Toaster />
        </div>
    );
}

export default App;
