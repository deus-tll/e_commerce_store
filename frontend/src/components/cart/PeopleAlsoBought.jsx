import {useEffect, useState} from 'react';

import axios from "../../config/axios.js";
import {PRODUCTS_API_PATH} from "../../stores/useProductStore.js";

import LoadingSpinner from "../LoadingSpinner.jsx";
import ProductGrid from "../ProductGrid.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
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
            <SectionHeader title="People also bought" />
            <ProductGrid products={recommendedProducts} />
        </div>
    );
};

export default PeopleAlsoBought;