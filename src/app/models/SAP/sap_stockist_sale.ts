export class SapStockistSale {

    total_net_amt: number = 0;
    stockist_code: number;
    brand_id: number;

    constructor(info: any) {
        if (info.total_net_amt)
            this.total_net_amt = parseFloat(info.total_net_amt);

        if (info.stockist_code)
            this.stockist_code = info.stockist_code;

        if (info.brand_id)
            this.brand_id = info.brand_id;
    }
}
