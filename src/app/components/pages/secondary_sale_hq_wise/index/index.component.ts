import {Component} from "@angular/core";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {SecondarySale} from "../../../../models/sale/secondary_sale";
import {SecondarySaleService} from "../../../../services/secondary_sale.service";
import {Customer} from "../../../../models/customer/customer";
import {Headquarter} from "../../../../models/territory/headquarter";
import {Region} from "../../../../models/territory/region";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class SecondarySaleHqWiseComponent extends ListComponent {

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return moment().year(this.year).month(this.month).format("MMMM, YYYY");
    }

    /**
     * get regions
     *
     * @type {Array}
     */
    regions: Region[] = [];

    /**
     * secondary sales
     *
     * @type {Array}
     */
    public secondary_sales: SecondarySale[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private saleService: SecondarySaleService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
        super.ngOnInit();
    }

    /**
     * fetch customer secondary sales from server
     */
    fetch() {

        this.saleService.hq_wise(this.month + 1, this.year).subscribe(
            response => {

                // convert to models
                let secondary_sales = response.secondary_sales.map(function (user, index) {
                    return new SecondarySale(user);
                });

                // convert to models
                this.regions = response.regions.map(function (region, index) {
                    return new Region(region);
                });

                // format data for display
                this.formatSecondarySale(secondary_sales);
            }
        );
    }

    /**
     * format secondary sales
     * @param secondary_sales
     */
    protected formatSecondarySale(secondary_sales: SecondarySale[]) {

        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    secondary_sales.map(sale => {
                        if (headquarter.id == sale.hq_headquarter_id) {
                            headquarter.unit_price = sale.unit_price;
                            headquarter.opening = sale.opening;
                            headquarter.adjustment = sale.adjustment;
                            headquarter.secondary_sale = sale.secondary_sale;
                            headquarter.secondary_amount = sale.secondary_amount;
                            headquarter.closing = sale.closing;
                        }
                    });

                    if (area.id == headquarter.hq_area_id) {
                        area.opening += headquarter.opening;
                        area.adjustment += headquarter.adjustment;
                        area.secondary_sale += headquarter.secondary_sale;
                        area.secondary_amount += headquarter.secondary_amount;
                        area.closing += headquarter.closing;

                    }

                    if (region.id == area.hq_region_id) {
                        region.opening += headquarter.opening;
                        region.adjustment += headquarter.adjustment;
                        region.secondary_sale += headquarter.secondary_sale;
                        region.secondary_amount += headquarter.secondary_amount;
                        region.closing += headquarter.closing;
                    }
                });
            });
        });

    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetch();
    }
}
