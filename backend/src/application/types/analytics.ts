export class AnalyticsSummaryDTO {
    public readonly users: number;
    public readonly products: number;
    public readonly totalSales: number;
    public readonly totalRevenue: number;

    constructor(data: {
        users: number;
        products: number;
        totalSales: number;
        totalRevenue: number;
    }) {
        this.users = data.users;
        this.products = data.products;
        this.totalSales = data.totalSales;
        this.totalRevenue = data.totalRevenue;

        Object.freeze(this);
    }
}

export class DailySalesDataDTO {
    public readonly date: string;
    public readonly sales: number;
    public readonly revenue: number;

    constructor(data: {
        date: string;
        sales: number;
        revenue: number;
    }) {
        this.date = data.date;
        this.sales = data.sales;
        this.revenue = data.revenue;

        Object.freeze(this);
    }
}

export class FullAnalyticsResponseDTO {
    public readonly analyticsData: AnalyticsSummaryDTO;
    public readonly dailySalesData: DailySalesDataDTO[];

    constructor(data: {
        analyticsData: AnalyticsSummaryDTO;
        dailySalesData: DailySalesDataDTO[]
    }) {
        this.analyticsData = data.analyticsData;
        this.dailySalesData = data.dailySalesData;

        Object.freeze(this);
    }
}