import {useEffect} from 'react';

import {useProductStore} from "../../stores/useProductStore.js";

import ProductGrid from "../product/ProductGrid.jsx";

import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";

const PeopleAlsoBought = () => {
	const { recommendations, loading, fetchRecommendations } = useProductStore();

	useEffect(() => {
		void fetchRecommendations();
	}, [fetchRecommendations]);

	if (loading && recommendations.length === 0) return <LoadingSpinner />;
	if (recommendations.length === 0) return null;

    return (
        <div className="mt-8">
            <SectionHeader title="People also bought" />
            <ProductGrid products={recommendations} />
        </div>
    );
};

export default PeopleAlsoBought;