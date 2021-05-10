import {Component, ViewChild, ElementRef} from '@angular/core';
import * as moment from 'moment';
import {AppConstants} from '../../../../app.constants';
import {AuthService} from '../../../../services/AuthService';
import {Holiday} from '../../../../models/holiday';
import {Observable} from 'rxjs/Rx';
import {SaleService} from '../../../../services/v2/sale.service';
import {ListComponent} from '../../../../components/base/list.component';

declare let jQuery: any;
declare let d3: any;
declare let swal: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class DailySalesComponent extends ListComponent {

  excel_loaded: boolean = false;
  btn_loading: boolean = false;
  date: number;
  public role_id: number = 0;
  public department_id: number = 0;
  public options: {};
  public chart_data = [];
  public month: number;
  public year: number;
  zone_id: number = 0;

  public list: string[] = [];
  public daily_sales: {};



  /**
   * get date range
   *
   * @returns {Array<number>}
   */
  get dates(): Array<number> {
    let dates = [];
    for (let d = 1; d <= moment().month(this.month).year(this.year).endOf('month').date(); d++) {
      dates.push(d);
    }
    return dates;
  }

  /**
   * get title of table
   * @returns {string}
   */
  get title(): string {
    return moment().year(this.year).month(this.month).format('MMMM, YYYY');
  }

  /**
   * Component Constructor
   *
   */
  constructor(public salesService: SaleService, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    if (this._service.user.hq_zone_id)
      this.zone_id = this._service.user.hq_zone_id;
    super.ngOnInit();

    if(this._service.user.role_str == 'COUNTRY_MNG')
      this.zone_id = 1;

    if (this._service.user.departments.length > 0)
      this.department_id = 0;

    if (this._service.user.departments.length > 0 && this._service.user.role_id == 6 )
      this.department_id = this._service.user.departments[0].pivot.department_id;

    this.month = moment().month();
    this.year = moment().year();
    this.fetch();
  }


  /**
   * fetch server data for visits
   */
  fetch() {
    this.loading = true;
    this.salesService.daily_sales()
    .subscribe(response => {
      // this.daily_sales = response.daily_sales;
      // Object.keys(this.daily_sales).forEach(key => {
      //   response['daily_sales'][key].forEach(data => {
      //
      //     const month_year = key;
      //     const {target, sales, days} = data;
      //
      //     console.log(month_year);
      //     console.log(target);
      //   });
      // });
      const sales_data = [];

      Object.keys(response.daily_sales).forEach((key) => {
        const month = {};
        month['time_frame'] = key;

        response['daily_sales'][key].forEach((data) => {
          const { target, sales, days } = data;
          month['target'] = target;

          const day = {};
          day['day'] = days;
          day['sales'] = sales;
          month['day'] = day;

          sales_data.push(month);
        });
      });
      console.log(sales_data);

      this.loading = false;
      }, err => {
      this.loading = false;
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
    this.excel_loaded = false;
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

}
