import {Component, Input} from "@angular/core";
import {ReportService} from "../../../../../services/report.service";
import {AuthService} from "../../../../../services/AuthService";
import * as moment from "moment";
import {Region} from "../../../../../models/territory/region";
import {Observable} from "rxjs";
import {Target} from "../../../../../models/SAP/target";
import {PrimarySale} from "../../../../../models/sale/primary_sale";
import {ListComponent} from "../../../../base/list.component";

@Component({
    selector: '[sales]',
    styleUrls: ['sales.component.less'],
    templateUrl: 'sales.component.html'
})
export class SalesComponent extends ListComponent {

    /**
     * month of sales
     */
    public _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
    }

    /**
     * year of sale
     */
    public _year: number;
    @Input()
    set year(year: number) {
        this._year = year;
    }

    /**
     * bricks
     *
     * @type {{}}
     */
    public regions = [];

    public total_primary_sale: number = 0;

    /**
     * TillMonthChartComponent constructor
     */
    constructor(private reportService: ReportService, public _service: AuthService) {
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
     * Chart data
     */
    fetch() {
        Observable.forkJoin(
            this.reportService.sales(this._month + 1, this._year),
            this.reportService.sales_yearly(this._year)
        ).subscribe(data => {

            // get regions
            this.regions = data[0].regions.map(region => new Region(region));

            // get targets monthly
            let targets = data[0].targets.map(target => new Target(target));
            let primaries = data[0].primary_sales.map(ps => new PrimarySale(ps));

            // get targets monthly
            let yearly_targets = data[1].targets.map(target => new Target(target));
            let yearly_primaries = data[1].primary_sales.map(ps => new PrimarySale(ps));

            // prepare data for table
            this.prepareData(targets, primaries);
        });
    }

    /**
     *
     * @param targets
     * @param primaries
     */
    prepareData(targets: Target[], primaries: PrimarySale[]) {
        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    targets.map(target => {
                        if (headquarter.id == target.hq_headquarter_id) {
                            headquarter.target = target.total_target ? target.total_target : 0;
                            area.target += target.total_target ? target.total_target : 0;
                            region.target += target.total_target ? target.total_target : 0;
                        }
                    });

                    primaries.map(primary => {
                        if (primary.hq_headquarter_id == headquarter.id) {
                            headquarter.primary = primary.total_net_amount;
                            area.primary += primary.total_net_amount;
                            region.primary += primary.total_net_amount;
                        }
                    })
                });
            });

            this.total_primary_sale += region.primary;
        });
    };
}
