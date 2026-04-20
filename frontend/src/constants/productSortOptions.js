const SORT_MODES = {
    NEWEST: { label: "Newest First", value: "createdAt-desc" },
    OLDEST: { label: "Oldest First", value: "createdAt-asc" },
    PRICE_ASC: { label: "Price: Low to High", value: "price-asc" },
    PRICE_DESC: { label: "Price: High to Low", value: "price-desc" },
    NAME_ASC: { label: "Name: A-Z", value: "name-asc" },
    TOP_RATED: { label: "Top Rated", value: "ratingStats.averageRating-desc" },
};

export const PRODUCT_SORT_OPTIONS = [
    SORT_MODES.NEWEST,
    SORT_MODES.PRICE_ASC,
    SORT_MODES.PRICE_DESC,
    SORT_MODES.TOP_RATED,
];

export const ADMIN_PRODUCT_SORT_OPTIONS = [
    SORT_MODES.NEWEST,
    SORT_MODES.OLDEST,
    SORT_MODES.PRICE_ASC,
    SORT_MODES.PRICE_DESC,
    SORT_MODES.NAME_ASC,
    SORT_MODES.TOP_RATED,
];