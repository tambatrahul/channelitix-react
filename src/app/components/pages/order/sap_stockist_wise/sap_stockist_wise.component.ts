import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {ReportService} from "../../../../services/report.service";
import {DownloadService} from '../../../../services/download.service';
import {Region} from "../../../../models/territory/region";
import * as moment from "moment";
import {Customer} from "../../../../models/customer/customer";
import {SapStockistSale} from "../../../../models/SAP/sap_stockist_sale";
import {Observable} from "rxjs";
import {Visit} from "../../../../models/visit/visit";
import {environment} from '../../../../../environments/environment';
import {WorkType} from '../../../../models/attendance/work_type';
import {Brand} from '../../../../models/order/brand';
import {SaleService} from '../../../../services/v2/sale.service';
import {StockistSalesPlanning} from '../../../../models/sale/stockist_sales_planning';
import {SecondarySale} from '../../../../models/sale/secondary_sale';

declare let jQuery: any;

@Component({
  templateUrl: 'sap_stockist_wise.component.html',
  styleUrls: ['sap_stockist_wise.component.less']
})
export class SapStockistWiseComponent extends ListComponent {

  excel_loaded: boolean = false;

  brands: Brand[] = [];

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public prev_month: number;
  public year: number;
  month_str: string;
  prev_month_str: string;
  public brand_name: string;
  public brand_id: number = 0;

  /**
   * region, area & headquarter
   */
  public zone_id: number = 0;
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;
  public department_id: number = 0;

  /**
   * editing false
   */
  editing: boolean = false;

  /**
   * get customers
   *
   * @type {Array}
   */
  customers: Customer[] = [];
  regions: Region[] = [];
  sales_planning: StockistSalesPlanning[] = [];

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public reportService: ReportService, public saleService: SaleService, public downloadService: DownloadService) {
    super(_service);
  }

  /**
   * on load of call fetch
   */
  ngOnInit() {
    this.month = moment().month();
    this.year = moment().year();

    if (this._service.user.role_id == 3) {
      this.region_id = this._service.user.hq_region_id;
      this.area_id = this._service.user.hq_area_id;
      this.headquarter_id = this._service.user.hq_headquarter_id;
    }
    if (this._service.user.role_id == 4) {
      this.region_id = this._service.user.hq_region_id;
      this.area_id = this._service.user.hq_area_id;
    }
    if (this._service.user.role_id == 5) {
      this.region_id = this._service.user.hq_region_id;
    }
    if (this._service.user.role_id == 6) {
      this.zone_id = this._service.user.hq_zone_id;
    }

    if (this._service.user.role_id == 7) {
      this.zone_id = 1;
    }
    if (this._service.user.departments.length > 0 )
      this.department_id = this._service.user.departments[0].pivot.department_id;

    if (this.department_id == 2) {
      this.brand_id = 4;
    }

    this.brand_id = 1;


    this.month_str = moment().month(this.month).format('MMM');
    this.prev_month_str = moment().month(this.month).subtract(1).format('MMM');
    super.ngOnInit();
  }

  protected fetch() {
  }

  /**
   * load users for logged in user
   */
  fetch_data() {
    if ((this.month || this.month == 0) && this.year) {
      this.loading = true;

      Observable.forkJoin(
        this.reportService.sap_stockist_wise_monthly(this.month + 1, this.year, this.region_id, this.area_id, this.headquarter_id, this.zone_id, this.brand_id, this.department_id),
        this.reportService.sap_stockist_wise_yearly(this.month + 1, this.year, this.region_id, this.area_id, this.headquarter_id, this.zone_id, this.brand_id, this.department_id)).subscribe(
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
          this.brands = response[0].brands;
          // get customers
          let customers = response[1].customers.map(cus => new Customer(cus));

          this.prepareData(regions, customers, yearly_sales, yearly_dexona_sales, last_month_sale,
            last_month_dexona_sale, visits_this_month_manager, visits_this_month_rep, current_month_sale, this.brands);

          this.loading = false;

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

        },
        err => {
          this.loading = false;
        }
      );
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
   * @param visits_this_month_manger
   * @param visits_this_month_rep
   * @param current_month_sale
   * @param brands
   */
  prepareData(regions: Region[], customers: Customer[], yearly_sales: SapStockistSale[], yearly_dexona_sales: SapStockistSale[],
              last_month_sale: SapStockistSale[], last_month_dexona_sale: SapStockistSale[], visits_this_month_manger: Visit[],
              visits_this_month_rep: Visit[], current_month_sale: SapStockistSale[], brands: Brand[]) {

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

            // Headquarter Wise Total
            if (cus.hq_headquarter_id == headquarter.id) {
              headquarter.customers.push(new Customer(cus));

              headquarter.hq_last_year_total += cus.last_year_sale;
              headquarter.hq_last_year_dexona_total += cus.last_year_dexona_sale;
              headquarter.hq_last_month_total += cus.last_month_sale;
              headquarter.hq_last_month_dexona_total += cus.last_month_dexona_sale;
            }

            // Area Wise Total
            if (cus.hq_area_id == area.id) {
              area.ar_last_year_total += cus.last_year_sale;
              area.ar_last_year_dexona_total += cus.last_year_dexona_sale;
              area.ar_last_month_total += cus.last_month_sale;
              area.ar_last_month_dexona_total += cus.last_month_dexona_sale;
            }

            // Region Wise Total
            if (cus.hq_region_id == region.id) {
              region.rg_last_year_total += cus.last_year_sale;
              region.rg_last_year_dexona_total += cus.last_year_dexona_sale;
              region.rg_last_month_total += cus.last_month_sale;
              region.rg_last_month_dexona_total += cus.last_month_dexona_sale;
            }
          });
        });
      });
    });

    if (this.region_id && this.region_id > 0)
      regions = regions.filter(region => region.id == this.region_id);

    if (this.area_id && this.area_id > 0) {
      regions.map(region => {
        region.areas = region.areas.filter(a => a.id == this.area_id);
      });
    }

    if (this.headquarter_id && this.headquarter_id > 0) {
      regions.map(region => {
        region.areas.map(area => {
          area.headquarters = area.headquarters.filter(h => h.id == this.headquarter_id);
        });
      });
    }

    brands.map(br => {
      if (this.brand_id == br.id) {
          this.brand_name = br.name;
      }
    });

    this.regions = regions;
  }

  /**
   * toggle editing
   */
  toggleEditing() {
    this.editing = !this.editing;
  }

  /**
   *  refresh data
   */
  refresh() {
    this.editing = !this.editing;
    this.fetch_data();
  }

  /**
   * save stockist plan sale
   */
  save() {

    const sales_planning: StockistSalesPlanning[] = [];
    for (const region of this.regions) {
      region.areas.forEach(area => {
        area.headquarters.forEach(headquarter => {
          headquarter.customers.forEach(cus => {
            cus.sales_planning.forEach(sp => {
              sales_planning.push(new StockistSalesPlanning({
                id : sp.id,
                plan_value: sp.plan_value,
                updated_by: sp.updated_by
              }));
            });
           });
          });
        });
      }

    // update to server
    this.loading = true;
    this.saleService.update_plan(sales_planning).subscribe(
      response => {
        this.loading = false;
        this.editing = false;
        this.fetch_data();
      },
      err => {
        this.loading = false;
      }
    );
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
  }

  /**
   * when region is changed filter list of customer
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.zone_id = zone_id;
    this.regionChanged(0);
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.region_id = region_id;
    this.areaChanged(0);

  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.area_id = area_id;
    this.headquarterChanged(0);

  }

  /**
   * when headquarter is changed filter list of customer
   * @param headquarter_id
   */
  headquarterChanged(headquarter_id) {
    this.headquarter_id = headquarter_id;

  }

  /**
   * brand Filter
   *
   * @param brand_id
   */
  brandChanged(brand_id) {
    this.brand_id = brand_id;

  }


  /**
   * department Filter
   *
   * @param department_id
   */
  departmentChanged(department_id) {
    this.department_id = department_id;
    if (this.department_id == 2)
      this.brand_id = 4;
    if (this.department_id == 1)
      this.brand_id = 1;
  }

  downloadMonthlySalesReport() {
    let url = this.downloadService.downloadMonthlySalesReport(this.month + 1, this.year, this.zone_id, this.region_id, this.area_id, this.brand_id, this.department_id);
    window.open(url, "_blank");
  }
}
