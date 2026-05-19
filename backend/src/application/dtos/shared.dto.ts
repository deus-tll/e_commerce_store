export class RepositoryPaginationResult<T> {
    public readonly results: T[];
    public readonly total: number;

    constructor(results: T[], total: number) {
        this.results = results;
        this.total = total;

        Object.freeze(this);
    }
}

export class PaginationMetadata {
    public readonly page: number;
    public readonly limit: number;
    public readonly total: number;
    public readonly pages: number;

    constructor(page: number, limit: number, total: number, pages: number) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.pages = pages;

        Object.freeze(this);
    }
}