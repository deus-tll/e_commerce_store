export const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString();
};

export const formatCurrency = (value, currency = "USD", locale = undefined) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return "";
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
};