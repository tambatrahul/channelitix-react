import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {ReportService} from "../../../../services/report.service";
import {Region} from "../../../../models/territory/region";
import * as moment from "moment";
import {Customer} from "../../../../models/customer/customer";
import {SapStockistSale} from "../../../../models/SAP/sap_stockist_sale";
import {Observable} from "rxjs";
import {Visit} from "../../../../models/visit/visit";

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
  public prev_month: number;
  public year: number;
  month_str: string;
  prev_month_str: string;

  /**
   * region, area & headquarter
   */
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;


  /**
   * get customers
   *
   * @type {Array}
   */
  customers: Customer[] = [];
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
    this.region_id = 2;

    this.month_str = moment().month(this.month).format('MMM');
    this.prev_month_str = moment().month(this.month).subtract(1).format('MMM');
    super.ngOnInit();
  }

  /**
   * load users for logged in user
   */
  fetch() {
    if (this.month && this.year) {
      this.loading = true;
      Observable.forkJoin(
        this.reportService.sap_stockist_wise_monthly(this.month + 1, this.year, this.region_id, this.area_id, this.headquarter_id),
        this.reportService.sap_stockist_wise_yearly(this.month + 1, this.year, this.region_id, this.area_id, this.headquarter_id)).subscribe(
        response => {
          let regions = response[1].regions.map(region => new Region(region));

          // filter for region
          if (this.region_id)
            regions = regions.filter(region => region.id == this.region_id);

          let last_month_sale = response[0].last_month_sale.map(lms => new SapStockistSale(lms));
          let last_month_dexona_sale = response[0].last_month_dexona_sale.map(lmds => new SapStockistSale(lmds));
          let yearly_sales = response[1].yearly_sales.map(ys => new SapStockistSale(ys));
          let yearly_dexona_sales = response[1].yearly_dexona_sales.map(yds => new SapStockistSale(yds));
          let visits_this_month_manager = response[0].visits_this_month_manager.map(visit => new Visit(visit));
          let visits_this_month_rep = response[0].visits_this_month_rep.map(visit => new Visit(visit));
          let current_month_sale = response[0].current_month_sale.map(cms => new SapStockistSale(cms));

          // get customers
          let customers = response[1].customers.map(cus => new Customer(cus));

          this.prepareData(regions, customers, yearly_sales, yearly_dexona_sales, last_month_sale,
            last_month_dexona_sale, visits_this_month_manager, visits_this_month_rep, current_month_sale);

          this.loading = false;

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
   *
   * @param regions
   * @param customers
   * @param yearly_sales
   * @param yearly_dexona_sales
   * @param last_month_sale
   * @param last_month_dexona_sale
   * @param visits_this_month
   * @param current_month_sale
   */
  prepareData(regions: Region[], customers: Customer[], yearly_sales: SapStockistSale[], yearly_dexona_sales: SapStockistSale[],
              last_month_sale: SapStockistSale[], last_month_dexona_sale: SapStockistSale[], visits_this_month_manger: Visit[],
              visits_this_month_rep: Visit[], current_month_sale: SapStockistSale[]) {

    // add customers  to individual hq

    regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          headquarter.customers = [];
          customers.map(cus => {

            yearly_sales.map(ys => {
              if (cus.code == ys.stockist_code) {
                cus.last_year_sale = ys.total_net_amt;
              }
            });

            visits_this_month_manger.map(visit => {
              if (cus.code == visit.stockist_code) {
                cus.visits_this_month_manager = visit.days;
              }
            });

            visits_this_month_rep.map(visit => {
              if (cus.code == visit.stockist_code) {
                cus.visits_this_month_rep = visit.days;
              }

            });

            yearly_dexona_sales.map(yds => {
              if (cus.code == yds.stockist_code) {
                cus.last_year_dexona_sale = yds.total_net_amt;
              }
            });

            last_month_sale.map(lms => {
              if (cus.code == lms.stockist_code) {
                cus.last_month_sale = lms.total_net_amt;
              }
            });

            current_month_sale.map(cms => {
              if (cus.code == cms.stockist_code) {
                cus.sap_primary_sale = cms.total_net_amt;
              }
            });

            last_month_dexona_sale.map(lmds => {
              if (cus.code == lmds.stockist_code) {
                cus.last_month_dexona_sale = lmds.total_net_amt;
              }
            });

            if (cus.hq_headquarter_id == headquarter.id) {
              headquarter.customers.push(new Customer(cus));
            }
          });
        });
      });
    });

    if (this.region_id && this.region_id > 0)
      regions = regions.filter(region => region.id == this.region_id);

    if (this.area_id && this.area_id > 0) {
      regions.map(region =>  {
        region.areas = region.areas.filter(a => a.id == this.area_id);
      });
    }

    if (this.headquarter_id && this.headquarter_id > 0) {
      regions.map(region =>  {
        region.areas.map(area => {
          area.headquarters = area.headquarters.filter(h => h.id == this.headquarter_id);
        });
      });
    }

    this.regions = regions;
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.month_str = moment().month(this.month).format('MMM');
    this.prev_month_str = moment().month(this.month).subtract(1, 'months').format('MMM');
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
