import {Component, Input} from "@angular/core";
import {ListComponent} from "../../base/list.component";
import {Product} from "../../../models/order/product";
import {AuthService} from "../../../services/AuthService";
import {ReportService} from "../../../services/report.service";
import * as moment from "moment";
import {SalesPlanningService} from "../../../services/sales_planning.service";
import {Customer} from "../../../models/customer/customer";
import {SapStockistSale} from "../../../models/SAP/sap_stockist_sale";
import {OpeningStock} from "../../../models/openning_stock";

@Component({
    styleUrls: ['sales_planning.component.less'],
    templateUrl: 'sales_planning.component.html'
})
export class SalesPlanningComponent extends ListComponent {

    /**
     * month of invoice
     */
    public _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
        this.fetch();
    }

    /**
     * year of invoice
     */
    public _year: number;
    @Input()
    set year(year: number) {
        this._year = year;
    }

    /**
     * editing false
     */
    editing: boolean = false;

    /**
     * Customer
     */
    customers: Customer[];


    constructor(public _service: AuthService, private salesPlanningService: SalesPlanningService) {
        super(_service);
    }

    /**
     * initialize data
     */
    ngOnInit() {
        super.ngOnInit();
        let current_month = moment();
        this._month = current_month.month();
        this._year = current_month.year();
        this.fetch();
    }

    /**
     * fetch counts from server
     */
    protected fetch() {
        if (this._month && this._year) {
            this.salesPlanningService.monthly(this._month, this._year, 4).subscribe(
                response => {
                    this.customers = response.customers.map(cus => new Customer(cus));
                    let last_month_sales = response.last_month_sales.map(lms => new SapStockistSale(lms));
                    let yearly_sales = response.yearly_sales.map(ys => new SapStockistSale(ys));
                    //let opening_stocks = response.opening_stocks.map(os => new OpeningStock(os));
                });
        }
    }

    /**
     * format performance data
     */
    protected formatData(last_month_sales : SapStockistSale, yearly_sales: SapStockistSale,
                         opening_stocks: OpeningStock) {

        this.customers.map(cus =>{

        });
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        let current_month = moment().month(date.month).year(date.year);
        this._month = current_month.month();
        this._year = current_month.year();
        this.fetch();
    }

    /**
     * toggle editing
     */
    toggleEditing() {
        this.editing = !this.editing;
    }
}
