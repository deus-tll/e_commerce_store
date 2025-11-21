import {Link} from "react-router-dom";
import {ShoppingCart, UserPlus, LogIn, LogOut, Lock, User} from "lucide-react";

import {useAuthStore} from "../stores/useAuthStore.js";
import {useCartStore} from "../stores/useCartStore.js";

import {UserRoles} from "../constants/app.js";

import Button from "./ui/Button.jsx";

const APP_NAME = import.meta.env.VITE_APP_NAME;

const Navbar = () => {
	const { user, logout } = useAuthStore();
	const { cart } = useCartStore();
	const isAdmin = user?.role === UserRoles.ADMIN;

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-wrap justify-between items-center">
					<Link to="/" className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex">
						{APP_NAME}
					</Link>

                    <nav className="flex flex-wrap items-center gap-4">
						{user && (
						<Link to="/cart" className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
								<ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20} />

								{cart.length > 0 &&
									<span className='absolute -top-1.5 -right-1 bg-emerald-500 text-white rounded-full px-1.5 py-0.6
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										{cart.length}
									</span>
								}

						</Link>
						)}

					{ user ? (
						<>
							<Link to="/profile" className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
								<User className="inline-block mr-1 group-hover:text-emerald-400" size={20} />
							</Link>
							{isAdmin && (
								<Link
									to="admin-dashboard"
									className="border border-emerald-600 text-emerald-400 px-3 py-1.5 rounded-full font-medium transition duration-300 ease-in-out flex items-center hover:bg-emerald-700/40"
								>
									<Lock className="inline-block mr-1" size={18} />
									<span className="hidden sm:inline">Dashboard</span>
								</Link>
							)}
                            <Button onClick={logout} variant="secondary" className="flex items-center gap-2">
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
						</>
						) : (
							<>
                                <Link to="/signup">
                                    <Button className="flex items-center gap-2">
                                        <UserPlus size={18} />
                                        Sign Up
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="secondary" className="flex items-center gap-2">
                                        <LogIn size={18} />
                                        Login
                                    </Button>
                                </Link>
							</>
						)}
					</nav>
				</div>
            </div>
		</header>
	);
};

export default Navbar;