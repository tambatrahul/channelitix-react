import {PrimarySale} from "../sale/primary_sale";
import {Target} from "./target";
import {SecondarySale} from "../sale/secondary_sale";
import {Product} from "../order/product";


export class Performance {

    // target fields
    targets: Target[];
    primary_sales: PrimarySale[];
    secondary_sales: SecondarySale[];

    products: Product[];

    constructor(info: any) {
        if (info.targets) {
            this.targets = info.targets.map(tar => new Target(tar));
        }

        if (info.primary_sales) {
            this.primary_sales = info.primary_sales.map(tar => new PrimarySale(tar));
        }

        if (info.secondary_sales) {
            this.secondary_sales = info.secondary_sales.map(tar => new SecondarySale(tar));
        }

        if (info.products)
            this.products = info.products.map(pro => new Product(pro));
    }
}
