import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ListComponent} from '../../../base/list.component';
import {AuthService} from '../../../../services/AuthService';
import {ReportService} from '../../../../services/report.service';
import {CustomerType} from '../../../../models/customer/customer_type';
import {Headquarter} from '../../../../models/territory/headquarter';
import {Visit} from '../../../../models/visit/visit';
import * as moment from 'moment';
import {Customer} from '../../../../models/customer/customer';
import {Order} from '../../../../models/order/order';
import {Attendance} from '../../../../models/attendance/attendance';
import {Region} from '../../../../models/territory/region';

declare let jQuery: any;

@Component({
  templateUrl: 'productivity_analysis_report.component.html',
  styleUrls: ['productivity_analysis_report.component.less']
})
export class ProductivityAnalysisReportComponent extends ListComponent {

  uploads;
  /**
   * dates
   *
   * @type {}
   */
  _dates: {
    from_date: '',
    to_date: '',
    year: ''
  };

  /**
   * get regions
   *
   * @type {Array}
   */
  regions: Region[] = [];
  zone_id: number = 0;
  public department_id: number = 0;


  /**
   * customer types
   *
   * @type {Array}
   */
  public customer_types: CustomerType[] = [];

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();

    if (this._service.user.departments.length > 0)
      this.department_id = 0;

    if (this._service.user.departments.length > 0 && this._service.user.role_id == 6 )
      this.department_id = this._service.user.departments[0].pivot.department_id;

  }

  /**
   * On date change
   * @param dates
   */
  onDateChanged(dates) {
    this._dates = dates;
    if (this._service.user.role_id == 7) {
      this.zone_id = 1;
    }
    this.fetch();
  }

  /*
   * load users for logged in user
   */
  fetch() {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).substring(0, 3) == 'te-') {
        localStorage.removeItem(localStorage.key(i));
      }
    }
    if (this._dates && this._dates.from_date && this._dates.to_date && !this.loading) {
      this.loading = true;
      this.reportService.productivity_analysis(this._dates.from_date, this._dates.to_date, this.zone_id, this.department_id).subscribe(
        data => {
          // get regions
          this.regions = data.regions.map(region => new Region(region));
          this.customer_types = data.customer_types.map(ct => new CustomerType(ct));

          // prepare visits
          let visits = data.visits.map(vis => new Visit(vis));

          // prepare orders
          let orders = data.orders.map(ord => new Order(ord));

          // prepare total orders
          let total_orders = data.order_counts.map(ord => new Order(ord));

          // prepare attendances
          let attendances = data.attendances.map(att => new Attendance(att));

          this.prepareData(attendances, visits, orders, total_orders);

          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      )
    }
  }

  /**
   * prepare data for headquarter wise customers
   *
   * @param attendances
   * @param visits
   * @param orders
   * @param total_orders
   */
  prepareData(attendances: Attendance[], visits: Visit[], orders: Order[], total_orders: Order[]) {
    this.regions.map(region => {
      // add customer types
      region.customer_types = this.customer_types.map(ct => new CustomerType(ct));

      region.areas.map(area => {
        // add customer types
        area.customer_types = this.customer_types.map(ct => new CustomerType(ct));

        area.headquarters.map(headquarter => {
          // add customer types
          headquarter.customer_types = this.customer_types.map(ct => new CustomerType(ct));

          visits.map(vis => {
            if (vis.hq_headquarter_id == headquarter.id) {
              headquarter.customer_types.map(ct => {
                if (ct.id == vis.customer_type_id) {
                  ct.visit_count = vis.visit_count;
                }
              });
              area.customer_types.map(ct => {
                if (ct.id == vis.customer_type_id) {
                  ct.visit_count += vis.visit_count;
                }
              });
              region.customer_types.map(ct => {
                if (ct.id == vis.customer_type_id) {
                  ct.visit_count += vis.visit_count;
                }
              });
              headquarter.total_visit += vis.visit_count;
              area.total_visit += vis.visit_count;
              region.total_visit += vis.visit_count;
            }
          });

          orders.map(ord => {
            if (ord.hq_headquarter_id == headquarter.id) {
              headquarter.customer_types.map(ct => {
                if (ct.id == ord.customer_type_id) {
                  ct.order_count = ord.order_total_count;
                }
              });
              area.customer_types.map(ct => {
                if (ct.id == ord.customer_type_id) {
                  ct.order_count += ord.order_total_count;
                }
              });
              region.customer_types.map(ct => {
                if (ct.id == ord.customer_type_id) {
                  ct.order_count += ord.order_total_count;
                }
              });
              headquarter.total_pob += ord.order_total_count;
              area.total_pob += ord.order_total_count;
              region.total_pob += ord.order_total_count;
            }
          });

          total_orders.map(ord => {
            if (ord.hq_headquarter_id == headquarter.id) {
              headquarter.customer_types.map(ct => {
                if (ct.id == ord.customer_type_id) {
                  ct.total_productive_avg = ord.order_count
                }
              });
              area.customer_types.map(ct => {
                if (ct.id == ord.customer_type_id) {
                  ct.total_productive_avg += ord.order_count
                }
              });
              region.customer_types.map(ct => {
                if (ct.id == ord.customer_type_id) {
                  ct.total_productive_avg += ord.order_count
                }
              });
              headquarter.total_order += ord.order_count;
              area.total_order += ord.order_count;
              region.total_order += ord.order_count;
            }
          });

          attendances.map(att => {
            if (att.hq_headquarter_id == headquarter.id) {
              headquarter.total_att += att.attendance_count;
              // headquarter.total_pob += att.pob_amount;
              headquarter.total_visit += att.no_of_calls;

              area.total_att += att.attendance_count;
              // area.total_pob += att.pob_amount;
              area.total_visit += att.no_of_calls;

              region.total_att += att.attendance_count;
              // region.total_pob += att.pob_amount;
              region.total_visit += att.no_of_calls;
            }
          });

        });
      });
    });

    setTimeout(() => {
      this.uploads = jQuery("table").tableExport({
        formats: ['xlsx'],
        bootstrap: true,
        position: "top"
      });
    }, 1000);
  }

  /**
   * when region is changed filter list of customer
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
