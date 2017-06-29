export class MonthStockistSale {

    // month sales fields
    monthly_stockist_sale: number = 0;
    monthly_stockist_count: number = 0;

    // month ab sales fields
    monthly_stockist_sale_ab: number = 0;
    monthly_stockist_ab_count: number = 0;

    constructor(info: any) {

        if (info.monthly_stockist_sale)
            this.monthly_stockist_sale = parseFloat((parseFloat(info.monthly_stockist_sale) / 10000).toFixed(0));

        if (info.monthly_stockist_count)
            this.monthly_stockist_count = parseFloat(info.monthly_stockist_count);

        if (info.monthly_stockist_sale_ab)
            this.monthly_stockist_sale_ab = parseFloat((parseFloat(info.monthly_stockist_sale_ab) / 10000).toFixed(0));

        if (info.monthly_stockist_ab_count)
            this.monthly_stockist_ab_count = parseFloat(info.monthly_stockist_ab_count);
    }
}
