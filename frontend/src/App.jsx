import AppRouter from "./config/router.jsx";
import Navbar from "./components/Navbar.jsx";
import BackgroundGradient from "./components/BackgroundGradient.jsx";

function App() {
	return (
        <div className="min-h-screen bg-gray-900 text-white relative, overflow-hidden">
	        <BackgroundGradient />
	        <div className="relative z-50 pt-20">
		        <Navbar />
		        <AppRouter />
	        </div>
        </div>
    );
}

export default App;
