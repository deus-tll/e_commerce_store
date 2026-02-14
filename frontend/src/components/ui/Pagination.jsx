import Button from "./Button.jsx";

const Pagination = ({ page, pages, onChange }) => {
    if (!pages || pages <= 1) return null;
    const start = Math.max(1, Math.min(pages - 4, page - 2));
    const items = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i).filter(n => n <= pages);

    const handlePageClick = (newPage) => {
        if (newPage !== page) {
            onChange(newPage);
        }
    };

    return (
        <div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-300">Page {page} of {pages}</div>
            <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => handlePageClick(Math.max(1, page - 1))} disabled={page === 1}>Prev</Button>
                {items.map((n) => (
                    <Button key={n} variant={n === page ? 'primary' : 'secondary'} onClick={() => handlePageClick(n)}>{n}</Button>
                ))}
                <Button variant="secondary" onClick={() => handlePageClick(Math.min(pages, page + 1))} disabled={page === pages}>Next</Button>
            </div>
        </div>
    );
};

export default Pagination;