import {useEffect, useState} from 'react';

import axios from "../../config/axios.js";
import {PRODUCTS_API_PATH} from "../../stores/useProductStore.js";

import LoadingSpinner from "../LoadingSpinner.jsx";
import ProductCard from "../ProductCard.jsx";
import {handleRequestError} from "../../utils/errorHandler.js";

const PeopleAlsoBought = () => {
	const [recommendedProducts, setRecommendedProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendedProducts = async () => {
			try {
				const res = await axios.get(`${PRODUCTS_API_PATH}/recommended`);
				setRecommendedProducts(res.data);
			}
			catch (error) {
				handleRequestError(error, "An error occurred while fetching recommended products");
			}
			finally {
				setIsLoading(false);
			}
		};

		fetchRecommendedProducts();
	}, []);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="mt-8">
			<h3 className="text-2xl font-semibold text-emerald-400">
				People also bought
			</h3>

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3">
				{recommendedProducts.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};

export default PeopleAlsoBought;