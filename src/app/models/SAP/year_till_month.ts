export class YearTillMonth {

    // target fields
    month_target: number = 0;
    till_month_target: number = 0;

    // sales fields
    month_sale: number = 0;
    till_month_sale: number = 0;

    constructor(info: any) {

        if (info.month_target)
            this.month_target = parseFloat((parseFloat(info.month_target)/100000).toFixed(0));

        if (info.till_month_target)
            this.till_month_target = parseFloat((parseFloat(info.till_month_target)/100000).toFixed(0));

        if (info.month_sale)
            this.month_sale = parseFloat((parseFloat(info.month_sale)/100000).toFixed(0));

        if (info.till_month_sale)
            this.till_month_sale = parseFloat((parseFloat(info.till_month_sale)/100000).toFixed(0));
    }
}
