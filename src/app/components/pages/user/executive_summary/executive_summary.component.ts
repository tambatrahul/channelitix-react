import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {ReportService} from "../../../../services/report.service";
import {V2ReportService} from "../../../../services/v2/report.service";
import {Region} from "../../../../models/territory/region";
import {PrimarySalesAndTargets} from "../../../../models/V2/SAP/primary_sales_and_targets";
import {Order} from "../../../../models/order/order";
import {Attendance} from "../../../../models/attendance/attendance";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Visit} from "../../../../models/visit/visit";
import * as moment from "moment";
import {Observable} from "rxjs/Rx";
import {Customer} from "../../../../models/customer/customer";

declare let jQuery: any;

@Component({
  templateUrl: 'executive_summary.component.html',
  styleUrls: ['executive_summary.component.less']
})
export class ExecutiveSummaryComponent extends ListComponent {

  excel_loaded: boolean = false;

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * zone
   */
  public zone_id: number = 0;

  public department_id: number = 0;


  /**
   * get regions
   *
   * @type {Array}
   */
  regions: Region[] = [];

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public reportService: ReportService, public v2ReportService: V2ReportService) {
    super(_service);
  }

  /**
     * Customer Coverage view flag
     * @type {boolean}
     */
   public coverage_view: boolean = true;

  /**
   * on load of call fetch
   */
  ngOnInit() {
    super.ngOnInit();
    if (this._service.user.hq_zone_id)
      this.zone_id = this._service.user.hq_zone_id;

    if(this._service.user.role_str == 'COUNTRY_MNG')
      this.zone_id = 1;

    if (this._service.user.departments.length > 0)
      this.department_id = 0;

    if (this._service.user.departments.length > 0 && (this._service.user.role_id == 6  || this._service.user.role_id == 8 ))
      this.department_id = this._service.user.departments[0].pivot.department_id;

    this.month = moment().month();
    this.year = moment().year();

  }

  /**
   * load users for logged in user
   */
  fetch() {
    if ((this.month || this.month == 0) && this.year) {
      this.loading = true;
      Observable.forkJoin(
        this.v2ReportService.executive_summary(this.month + 1, this.year, this.zone_id, this.department_id),
        this.reportService.hq_wise_visit_counts(this.month + 1, this.year, this.zone_id)
      ).subscribe(data => {
        // get regions
        this.regions = data[0].regions.map(region => new Region(region));
        let customerTypes = data[0].customer_types.map(ct => new CustomerType(ct));

        // get targets and sales
        let primarySalesAndTargets = data[0].primary_sales_and_targets.map(primarySalesAndTarget => new PrimarySalesAndTargets(primarySalesAndTarget));
        this.mapPrimarySalesAndTargets(primarySalesAndTargets,  customerTypes);

        // get orders
        let orders = data[0].orders.map(ord => new Order(ord));
        this.mapOrders(orders);

        // get visits and attendances
        let visits = data[0].visits.map(vis => new Visit(vis));
        let attendances = data[0].attendances.map(att => new Attendance(att));

        this.mapAttendances(attendances, visits);

        // prepare customers
        let customers = data[1].customers.map(cus => new Customer(cus));
        let visit_counts = data[1].visits.map(visit => new Visit(visit));


        // get v2 and v3 visits
        let v2_v3_visits = data[1].v2_v3_visits.map(visit => new Visit(visit));

        // preparing data for display
        this.prepareData(visit_counts, customers, v2_v3_visits);
        this.loading = false;

      });
    }
  }

  /**
   * prepare data for headquarter wise customers
   *
   * @param visits
   * @param customers
   * @param v2_v3_visits
   */
  prepareData(visits: Visit[], customers: Customer[], v2_v3_visits: Visit[]) {

    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          visits.map(vis => {
            if (vis.hq_headquarter_id == headquarter.id) {
              headquarter.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == vis.grade_id)
                    grade.visit_count += vis.visit_count;
                });
              });
              area.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == vis.grade_id)
                    grade.visit_count += vis.visit_count;
                });
              });
              region.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == vis.grade_id)
                    grade.visit_count += vis.visit_count;
                });
              });
            }
          });

          visits.map(vis => {
            if (vis.hq_headquarter_id == headquarter.id) {
              headquarter.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == vis.grade_id)
                    grade.all_visit_count += vis.all_visit_count;
                });
              });
              area.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == vis.grade_id)
                    grade.all_visit_count += vis.all_visit_count;
                });
              });
              region.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == vis.grade_id)
                    grade.all_visit_count += vis.all_visit_count;
                });
              });
            }
          });

          customers.map(cus => {
            if (cus.hq_headquarter_id == headquarter.id) {
              headquarter.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == cus.grade_id)
                    grade.customer_count += cus.visit_count
                });
              });
              area.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == cus.grade_id)
                    grade.customer_count += cus.visit_count
                });
              });
              region.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == cus.grade_id)
                    grade.customer_count += cus.visit_count
                });
              });
            }
          });

          v2_v3_visits.map(visit => {
            if (visit.hq_headquarter_id == headquarter.id) {
              headquarter.customer_types[0].v2_count += visit.visited_twice;
              headquarter.customer_types[0].v3_count += visit.visited_thrice;
              area.customer_types[0].v2_count += visit.visited_twice;
              area.customer_types[0].v3_count += visit.visited_thrice;
              region.customer_types[0].v2_count += visit.visited_twice;
              region.customer_types[0].v3_count += visit.visited_thrice;
            }
          });
        });
      });
    });
  }

  /**
   * map targets and sales
   *
   * @param primarySalesAndTargets
   * @param customerTypes
   */
   mapPrimarySalesAndTargets(primarySalesAndTargets: PrimarySalesAndTargets[], customerTypes: CustomerType[]) {
    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          primarySalesAndTargets.map(target => {

            if (target.hq_headquarter_id == headquarter.id) {
              headquarter.target += target.total_target ? target.total_target : 0;
              headquarter.primary += target.total_net_amount;
              headquarter.quantity += target.total_net_quantity ? target.total_net_quantity : 0;

              if (target.sub_name == 'Gelusil') {
                headquarter.gelusil_target += target.total_target ? target.total_target : 0;
                headquarter.gelusil_primary += target.total_net_amount;
              }

              if (target.sub_name == 'Becosule') {
                headquarter.becosules_target += target.total_target ? target.total_target : 0;
                headquarter.becosules_primary = target.total_net_amount;
              }

              if (target.hq_headquarter_id == headquarter.parent_headquarter_id) {
                area.target += target.total_target ? target.total_target : 0;
                area.primary += target.total_net_amount;
                area.quantity += target.total_net_quantity ? target.total_net_quantity : 0;

                region.target += target.total_target ? target.total_target : 0;
                region.primary += target.total_net_amount;
                region.quantity += target.total_net_quantity ? target.total_net_quantity : 0; 

                if (target.sub_name == 'Gelusil') {
                  area.gelusil_target += target.total_target ? target.total_target : 0;
                  area.gelusil_primary += target.total_net_amount;

                  region.gelusil_target += target.total_target ? target.total_target : 0;
                  region.gelusil_primary += target.total_net_amount;
                }

                if (target.sub_name == 'Becosule') {
                  area.becosules_target += target.total_target ? target.total_target : 0;
                  area.becosules_primary += target.total_net_amount;

                  region.becosules_target += target.total_target ? target.total_target : 0;
                  region.becosules_primary += target.total_net_amount;
                }
              }
            }

          });

          headquarter.customer_types = customerTypes.map(ct => new CustomerType(ct));
        });
        area.customer_types = customerTypes.map(ct => new CustomerType(ct));
      });
      region.customer_types = customerTypes.map(ct => new CustomerType(ct));
    });
  }

  /**
   * map Orders
   *
   * @param orders
   */
  mapOrders(orders: Order[]) {
    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          orders.map(ord => {
            if (ord.hq_headquarter_id == headquarter.id) {
              headquarter.total_pob += ord.order_total_count;
              area.total_pob += ord.order_total_count;
              region.total_pob += ord.order_total_count;
            }

            if (ord.hq_headquarter_id == headquarter.id) {
              if (ord.sub_name == 'Gelusil') {
                headquarter.gelusil_total_pob += ord.order_total_count;
                area.gelusil_total_pob += ord.order_total_count;
                region.gelusil_total_pob += ord.order_total_count;
              }
            }

            if (ord.hq_headquarter_id == headquarter.id) {
              if (ord.sub_name == 'Becosule') {
                headquarter.becosules_total_pob += ord.order_total_count;
                area.becosules_total_pob += ord.order_total_count;
                region.becosules_total_pob += ord.order_total_count;
              }
            }
          });
        });
      });
    });
  }

  /**
   * map Attendances
   *
   * @param attendances
   * @param visits
   */
  mapAttendances(attendances: Attendance[], visits: Visit[]) {

    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          attendances.map(att => {
            if (att.hq_headquarter_id == headquarter.id) {
              // headquarter.total_pob += att.pob_amount;
              // headquarter.total_visit += att.no_of_calls;
              headquarter.total_att += att.att_count;
              // area.total_pob += att.pob_amount;
              // area.total_visit += att.no_of_calls;
              area.total_att += att.att_count;
              // region.total_pob += att.pob_amount;
              // region.total_visit += att.no_of_calls;
              region.total_att += att.att_count;


            }
          });
          visits.map(vis => {
            if (vis.hq_headquarter_id == headquarter.id) {
              headquarter.total_visit += vis.visit_count;
              area.total_visit += vis.visit_count;
              region.total_visit += vis.visit_count;
            }
          });

          visits.map(vis => {
            if (vis.hq_headquarter_id == headquarter.id) {
              headquarter.all_total_visit += vis.all_visit_count;
              area.all_total_visit += vis.all_visit_count;
              region.all_total_visit += vis.all_visit_count;
            }
          });
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
   * Toggle Customer coverage view
   */
  toggleCoverageView() {
    this.coverage_view = !this.coverage_view;
  }

  /**
   * Download Excel For Executive Summary
   */
  download() {

    this.reportService.executive_summary_download(this.month + 1, this.year, this.zone_id, this.department_id).subscribe(
      response => {
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "Executive_Summary.xls";
        link.click();

      },
      err => {

      }
    );
  }
}
