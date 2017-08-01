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
     * @param headquarters
     * @param secondary_sales
     */
    protected formatSecondarySale(secondary_sales: SecondarySale[]) {

        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    for (let sale of secondary_sales) {

                        if (headquarter.id == sale.hq_headquarter_id) {
                            headquarter.unit_price = sale.unit_price;
                            headquarter.opening = sale.opening;
                            headquarter.adjustment = sale.adjustment;
                            headquarter.secondary_sale = sale.secondary_sale;
                            headquarter.closing = sale.closing;

                        }
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
