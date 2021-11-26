import { Model } from "../../model";

export class Summary extends Model {

    monthYear: number = 0;
    department: string;
    totalNetAmount: number = 0;
    totalTarget: number = 0;
    achievement: number = 0;
    growth: number = 0;
    pobToSalesRate: number = 0;
    totalPob: number = 0;
    totalOrders: number = 0;
    productiveCalls: number = 0;

    constructor(info: any) {
        super(info.id);

        if (info.month_year)
            this.monthYear = parseInt(info.month_year);

        if (info.department)
            this.department = info.department;

        if (info.total_net_amt)
            this.totalNetAmount = parseFloat(info.total_net_amt);

        if (info.total_target)
            this.totalTarget = parseFloat(info.total_target);

        if (info.achievement)
            this.achievement = parseFloat(info.achievement);

        if (info.growth)
            this.growth = parseFloat(info.growth);

        if (info.pob_to_sales_rate)
            this.pobToSalesRate = parseFloat(info.pob_to_sales_rate);

        if (info.growth)
            this.totalPob = parseFloat(info.total_pob);

        if (info.total_orders)
            this.totalOrders = parseFloat(info.total_orders);

        if (info.productive_calls)
            this.productiveCalls = parseFloat(info.productive_calls);
    }
}
