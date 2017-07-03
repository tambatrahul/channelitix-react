import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {ReportService} from "../../../../services/report.service";
import {Region} from "../../../../models/territory/region";
import {Target} from "../../../../models/SAP/target";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {Order} from "../../../../models/order/order";
import {Attendance} from "../../../../models/attendance/attendance";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Visit} from "../../../../models/visit/visit";
import * as moment from "moment";
import {Observable} from "rxjs/Rx";
import {Customer} from "../../../../models/customer/customer";

declare let jQuery: any;

@Component({
    templateUrl: 'sap_stockist_wise.component.html',
    styleUrls: ['sap_stockist_wise.component.less']
})
export class SapStockistWiseComponent extends ListComponent {

    excel_loaded: boolean = false;

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * region, area & headquarter
     */
    public region_id: number = 0;
    public area_id: number = 0;
    public headquarter_id: number = 0;


    /**
     * get regions
     *
     * @type {Array}
     */
    regions: Region[] = [];

    /**
     * User Component Constructor
     */
    constructor(public _service: AuthService, public reportService: ReportService) {
        super(_service);
    }

    /**
     * on load of call fetch
     */
    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
        super.ngOnInit();
    }

    /**
     * load users for logged in user
     */
    fetch() {
        if (this.month && this.year) {
            this.loading = true;

            this.reportService.sap_stockist_wise(this.month + 1, this.year, this.region_id, this.area_id, this.headquarter_id).subscribe(
                response => {

                },
                err => {
                    this.loading = false;
                }
            );

            // show excel download
            setTimeout(() => {
                if (!this.excel_loaded) {
                    this.excel_loaded = true;
                    jQuery("table").tableExport({
                        formats: ['xlsx'],
                        bootstrap: true,
                        position: "top"
                    });
                }
            }, 1000);
        }
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

    /**
     * when region is changed filter list of customer
     * @param region_id
     */
    regionChanged(region_id) {
        this.region_id = region_id;
        this.areaChanged(0);
        this.fetch();
    }

    /**
     * when area is changed filter list of customer
     * @param area_id
     */
    areaChanged(area_id) {
        this.area_id = area_id;
        this.headquarterChanged(0);
        this.fetch();
    }

    /**
     * when headquarter is changed filter list of customer
     * @param headquarter_id
     */
    headquarterChanged(headquarter_id) {
        this.headquarter_id = headquarter_id;
        this.fetch();
    }
}
