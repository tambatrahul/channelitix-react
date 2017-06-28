export class YearStockistSale {

    // month sales fields
    yearly_stockist_sale: number = 0;
    yearly_stockist_count: number = 0;

    // month ab sales fields
    yearly_stockist_sale_ab: number = 0;
    yearly_stockist_ab_count: number = 0;

    constructor(info: any) {

        if (info.yearly_stockist_sale)
            this.yearly_stockist_sale = parseFloat((parseFloat(info.yearly_stockist_sale) / 100000).toFixed(0));

        if (info.yearly_stockist_count)
            this.yearly_stockist_count = parseFloat(info.yearly_stockist_count);

        if (info.yearly_stockist_sale_ab)
            this.yearly_stockist_sale_ab = parseFloat((parseFloat(info.yearly_stockist_sale_ab) / 100000).toFixed(0));

        if (info.yearly_stockist_ab_count)
            this.yearly_stockist_ab_count = parseFloat(info.yearly_stockist_ab_count);
    }
}
