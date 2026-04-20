import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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

    if (pages < 1) return null;

    return (
        <div className="flex justify-center pt-5 pb-5">
            <div className="bg-gray-700 px-6 py-3 flex items-center justify-between rounded">
                <div className="text-sm text-gray-300 me-4">Page {page} of {pages}</div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 border-r border-gray-700 pe-2">
                        <Button variant="secondary" onClick={() => handlePageClick(1)} disabled={page === 1}>
                            <ChevronsLeft className="w-5 h-5" />
                        </Button>

                        <Button variant="secondary" onClick={() => handlePageClick(Math.max(1, page - 1))} disabled={page === 1}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </div>

                    <div>
                        {items.map((n) => (
                            <Button
                                key={n}
                                variant={n === page ? 'primary' : 'ghost'}
                                className={`w-10 h-10 p-0 ${n === page ? 'shadow-lg shadow-emerald-900/20' : 'text-gray-400'}`}
                                onClick={() => handlePageClick(n)}
                            >
                                {n}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 border-l border-gray-700 ps-2">
                        <Button variant="secondary" onClick={() => handlePageClick(Math.min(pages, page + 1))} disabled={page === pages}>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                        <Button variant="secondary" onClick={() => handlePageClick(pages)} disabled={page === pages}>
                            <ChevronsRight className="w-5 h-5" />
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Pagination;