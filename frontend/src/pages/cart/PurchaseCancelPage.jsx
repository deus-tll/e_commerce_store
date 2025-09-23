import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

const PurchaseCancelPage = () => {
	return (
		<Container size="sm">
            <div>
				<Card className="p-6 sm:p-8 text-center">
					<div className="flex justify-center">
						<XCircle className="text-red-500 w-16 h-16 mb-4" />
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold text-center text-red-500 mb-2">Purchase Cancelled</h1>
					<p className="text-gray-300 text-center mb-6">Your order has been cancelled. No charges have been made.</p>
					<div className="bg-gray-700 rounded-lg p-4 mb-6">
						<p className="text-sm text-gray-400 text-center">If you encountered any issues during the checkout process, please {"don't"} hesitate to contact our support team.</p>
					</div>
					<div className="space-y-4">
						<Link to="/">
							<Button className="w-full justify-center">
								<ArrowLeft className="mr-2" size={18} />
								Return to Shop
							</Button>
						</Link>
					</div>
                </Card>
            </div>
		</Container>
	);
};

export default PurchaseCancelPage;