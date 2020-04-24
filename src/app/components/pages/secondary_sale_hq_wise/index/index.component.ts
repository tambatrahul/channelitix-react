import {Component} from "@angular/core";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {SecondarySale} from "../../../../models/sale/secondary_sale";
import {SecondarySaleService} from "../../../../services/secondary_sale.service";
import {Region} from "../../../../models/territory/region";
import {PrimarySale} from "../../../../models/sale/primary_sale";
import {Order} from "../../../../models/order/order";
import {AppConstants} from '../../../../app.constants';
import {Target} from '../../../../models/SAP/target';

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
  btn_loading: boolean = false;
  public department_id: number = 0;


  /**
   * zone
   */
  public zone_id: number = 0;

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
   * Chart data
   */
  fetchSecondary = AppConstants.debounce(function () {
    const self = this;
    self.loading = true;
    self.saleService.hq_wise(self.month + 1, self.year, self.zone_id, self.department_id).subscribe(
      response => {
        self.loading = false;
        // convert to models
        let secondary_sales = response.secondary_sales.map(function (sale, index) {
          return new SecondarySale(sale);
        });

        // get primary sales
        let primaries = response.primary_sales.map(function (ps, index) {
          return new PrimarySale(ps)
        });

        // convert to models
        self.regions = response.regions.map(function (region, index) {
            return new Region(region);
          },
          err => {
            self.loading = false;
          }
        );

        // get Orders
        let orders = response.orders.map(function (ord, index) {
          return new Order(ord);
        });

        // format data for display
        self.formatSecondarySale(secondary_sales, primaries, orders);
      }
    )
  }, 1000, false);

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
    if (this._service.user.hq_zone_id)
      this.zone_id = this._service.user.hq_zone_id;

    if (this._service.user.department.length > 0)
      this.department_id = this._service.user.department[0].pivot.department_id;

    this.month = moment().month() - 1;
    this.year = moment().year();
    if (this.month < 0) {
      this.year = this.year - 1;
      this.month = 11
    }
    super.ngOnInit();
    if(this._service.user.role_str == 'COUNTRY_MNG')
      this.zone_id = 1;


    this.fetch();

  }

  /**
   * fetch customer secondary sales from server
   */
  fetch() {
    this.fetchSecondary();
  }

  /**
   * format secondary sales
   * @param secondary_sales
   * @param primaries
   * @param orders
   */
  protected formatSecondarySale(secondary_sales: SecondarySale[], primaries: PrimarySale[], orders: Order[]) {

    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          secondary_sales.map(sale => {
            if (headquarter.id == sale.hq_headquarter_id) {
              headquarter.opening_value = sale.opening_value;
              headquarter.opening = sale.opening;
              headquarter.adjustment = sale.adjustment;
              headquarter.secondary_sale = sale.secondary_sale;
              headquarter.closing = sale.closing;
              headquarter.closing_value = sale.closing_value;
            }
          });

          primaries.map(ps => {
            if (headquarter.id == ps.hq_headquarter_id) {
              headquarter.total_net_amount = ps.total_net_amount;
            }
          });

          orders.map(ord => {
            if (headquarter.id == ord.hq_headquarter_id) {
              headquarter.total_order += ord.order_total_count;
            }
          });

          area.opening += headquarter.opening;
          area.opening_value += headquarter.opening_value;
          area.adjustment += headquarter.adjustment;
          area.secondary_sale += headquarter.secondary_sale;
          area.closing += headquarter.closing;
          area.closing_value += headquarter.closing_value;
          area.total_net_amount += headquarter.total_net_amount;
          area.total_order += headquarter.total_order;

        });

        region.opening += area.opening;
        region.opening_value += area.opening_value;
        region.adjustment += area.adjustment;
        region.secondary_sale += area.secondary_sale;
        region.closing += area.closing;
        region.closing_value += area.closing_value;
        region.total_net_amount += area.total_net_amount;
        region.total_order += area.total_order;
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
  /**
   * zone changed
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.zone_id = zone_id;
    this.fetch();
  }

  /**
   * department Filter
   *
   * @param department_id
   */
  departmentChanged(department_id) {
    this.department_id = department_id;
    this.fetch();
  }
  /**
   * Download Excel For Executive Summary
   */
  download() {
    this.btn_loading = true;
    this.saleService.secondary_sale_excel_download(this.month + 1, this.year, this.zone_id, this.department_id).subscribe(
      response => {
        this.btn_loading = false;
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "Secondary_Sale_Report.xls";
        link.click();

      },
      err => {
        this.btn_loading = false;
      }
    );
  }

}
