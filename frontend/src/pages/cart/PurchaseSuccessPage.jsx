import {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import Confetti from "react-confetti";
import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

import {useCartStore} from "../../stores/useCartStore.js";

import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const PurchaseSuccessPage = () => {
	const { finalizeCheckout, processingCheckout, checkoutError } = useCartStore();
	const orderNumber = "12345";

	const [confettiKey, setConfettiKey] = useState(0);

	useEffect(() => {
		const sessionId = new URLSearchParams(window.location.search).get("session_id");

		finalizeCheckout(sessionId);
	}, [finalizeCheckout]);

	if (processingCheckout) return <LoadingSpinner /> ;

	if (checkoutError) return `Error: ${checkoutError}`;

	const handleThanksClick = () => {
		setConfettiKey(prevKey => prevKey + 1);
	};

    return (
        <Container size="sm">
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
				key={confettiKey}
			/>

            <Card className="p-6 sm:p-8 relative z-10">
					<div className="flex justify-center">
						<CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
					</div>

					<h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
						Purchase Successful!
					</h1>

					<p className="text-gray-300 text-center mb-2">
						Thank you for your order. {"We're"} processing it now.
					</p>

					<p className="text-emerald-400 text-center text-sm mb-6">
						Check your email for order details and updates.
					</p>

					<div className="bg-gray-700 rounded-lg p-4 mb-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-400">
								Order number
							</span>

							<span className="text-sm font-semibold text-emerald-400">
								#{orderNumber}
							</span>
						</div>

						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-400">
								Estimated delivery
							</span>

							<span className=" text-sm font-semibold text-emerald-400">
								3-5 business days
							</span>
						</div>
					</div>

                    <div className="space-y-4">
                        <Button onClick={handleThanksClick} className="w-full justify-center">
                            <HandHeart className="mr-2" size={18} />
                            Thanks for trusting us!
                        </Button>
                        <Link to="/">
                            <Button variant="secondary" className="w-full justify-center">
                                Continue Shopping
                                <ArrowRight className="ml-2" size={18} />
                            </Button>
                        </Link>
                    </div>
                </Card>
        </Container>
	);
};

export default PurchaseSuccessPage;