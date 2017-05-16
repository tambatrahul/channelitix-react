import {Component, Input} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {PrimarySaleService} from "../../../../services/primary_sale.service";
import {InvoiceDetail} from "../../../../models/SAP/invoice_detail";
declare let jQuery: any;

@Component({
    selector: 'stockist-wise',
    templateUrl: 'stockist_wise.component.html',
    styleUrls: ['stockist_wise.component.less']
})
export class StockistWiseComponent extends ListComponent {

    /**
     * title for form
     *
     * @type {string}
     */
    title: string = "";

    public _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
        this.fetch();
    }

    public _year: number;
    @Input()
    set year(year: number) {
        this._year = year;
    }

    /**
     * region, area, headquarter
     */
    _region_id: number = 0;
    @Input()
    set region_id(region_id: number) {
        this._region_id = region_id;
        this.fetch();
    }

    _area_id: number = 0;
    @Input()
    set area_id(area_id: number) {
        this._area_id = area_id;
        this.fetch();
    }

    _headquarter_id: number = 0;
    @Input()
    set headquarter_id(headquarter_id: number) {
        this._headquarter_id = headquarter_id;
        this.fetch();
    }

    /**
     * invoice detail
     *
     * @type {Array}
     */
    public invoice_details: InvoiceDetail[] = [];

    /**
     * Monthly Tour Program Constructor
     *
     * @param saleService
     * @param _service
     */
    constructor(private saleService: PrimarySaleService, public _service: AuthService) {
        super(_service);
    }

    /**
     * fetch from server
     */
    fetch() {
        if (this._month && this._year) {
            this.loading = true;
            this.saleService.monthly_stockist(this._month + 1,
                this._year, this._region_id, this._area_id, this._headquarter_id).subscribe(
                response => {
                    this.loading = false;

                    // convert to models
                    this.invoice_details = response.invoice_details.map(function (user, index) {
                        return new InvoiceDetail(user);
                    });
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }
}
