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
    super.ngOnInit();
    if(this._service.user.role_str == 'COUNTRY_MNG')
      this.zone_id = 1;

    this.month = moment().month();
    this.year = moment().year();
    super.ngOnInit();
  }

  /**
   * load users for logged in user
   */
  fetch() {
    if ((this.month || this.month == 0) && this.year) {
      this.loading = true;
      Observable.forkJoin(
        this.reportService.executive_summary(this.month + 1, this.year, this.zone_id),
        this.reportService.hq_wise_visit_counts(this.month + 1, this.year, this.zone_id)
      ).subscribe(data => {
        // get regions
        this.regions = data[0].regions.map(region => new Region(region));
        let customer_types = data[0].customer_types.map(ct => new CustomerType(ct));

        // get targets
        let targets = data[0].targets.map(target => new Target(target));
        let skinlite_targets = data[0].skinlite_targets.map(target => new Target(target));
        this.mapTargets(targets, skinlite_targets, customer_types);

        // get primary sales
        let primaries = data[0].primary_sales.map(ps => new PrimarySale(ps));
        let skinlite_primaries = data[0].skinlite_primary_sales.map(ps => new PrimarySale(ps));
        this.mapPrimary(primaries, skinlite_primaries);

        // get orders
        let orders = data[0].orders.map(ord => new Order(ord));
        let skinlite_orders = data[0].skinlite_orders.map(ord => new Order(ord));
        this.mapOrders(orders,skinlite_orders);

        // get visits and attendances
        let visits = data[0].visits.map(vis => new Visit(vis));
        let attendances = data[0].attendances.map(att => new Attendance(att));

        // get all visits and map it to visits and attendances
        let all_visits = data[1].all_visits.map(vis => new Visit(vis));
        this.mapAttendances(attendances, visits, all_visits);

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
                    grade.visit_count = vis.visit_count
                });
              });
              area.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == vis.grade_id)
                    grade.visit_count += vis.visit_count
                });
              });
              region.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == vis.grade_id)
                    grade.visit_count += vis.visit_count
                });
              });
            }
          });

          customers.map(cus => {
            if (cus.hq_headquarter_id == headquarter.id) {
              headquarter.customer_types.map(ct => {
                ct.grades.map(grade => {
                  if (grade.id == cus.grade_id)
                    grade.customer_count = cus.visit_count
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
   * map targets
   *
   * @param targets
   * @param skinlite_targets
   * @param customer_types
   */
  mapTargets(targets: Target[], skinlite_targets: Target[], customer_types: CustomerType[]) {
    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          targets.map(target => {
            if (target.hq_headquarter_id == headquarter.id) {
              headquarter.target = target.total_target ? target.total_target : 0;
              area.target += target.total_target ? target.total_target : 0;
              region.target += target.total_target ? target.total_target : 0;
            }
          });
          skinlite_targets.map(target => {
            if (target.hq_headquarter_id == headquarter.id) {
              headquarter.skinlite_target = target.total_target ? target.total_target : 0;
              area.skinlite_target += target.total_target ? target.total_target : 0;
              region.skinlite_target += target.total_target ? target.total_target : 0;
            }
          });
          headquarter.customer_types = customer_types.map(ct => new CustomerType(ct));
        });
        area.customer_types = customer_types.map(ct => new CustomerType(ct));
      });
      region.customer_types = customer_types.map(ct => new CustomerType(ct));
    });
  }

  /**
   * map Primary
   *
   * @param primaries
   * @param skinlite_primaries
   */
  mapPrimary(primaries: PrimarySale[], skinlite_primaries: PrimarySale[]) {
    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          primaries.map(primary => {
            if (primary.hq_headquarter_id == headquarter.id) {
              headquarter.primary = primary.total_net_amount;
              area.primary += primary.total_net_amount;
              region.primary += primary.total_net_amount;
            }
          });
          skinlite_primaries.map(primary => {
            if (primary.hq_headquarter_id == headquarter.id) {
              headquarter.skinlite_primary = primary.total_net_amount;
              area.skinlite_primary += primary.total_net_amount;
              region.skinlite_primary += primary.total_net_amount;
            }
          });
        });
      });
    });
  }

  /**
   * map Orders
   *
   * @param orders
   * @param skinlite_orders
   */
  mapOrders(orders: Order[],skinlite_orders: Order[]) {
    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          orders.map(ord => {
            if (ord.hq_headquarter_id == headquarter.id) {
              headquarter.total_pob += ord.order_total_count;
              area.total_pob += ord.order_total_count;
              region.total_pob += ord.order_total_count;
            }
          });
          skinlite_orders.map(ord => {
            if (ord.hq_headquarter_id == headquarter.id) {
              headquarter.skinlite_total_pob += ord.order_total_count;
              area.skinlite_total_pob += ord.order_total_count;
              region.skinlite_total_pob += ord.order_total_count;
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
   * @param all_visits
   */
  mapAttendances(attendances: Attendance[], visits: Visit[], all_visits: Visit[]) {

    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          attendances.map(att => {
            if (att.hq_headquarter_id == headquarter.id) {
              headquarter.total_pob += att.pob_amount;
              headquarter.total_visit += att.no_of_calls;
              headquarter.total_att += att.att_count;
              area.total_pob += att.pob_amount;
              area.total_visit += att.no_of_calls;
              area.total_att += att.att_count;
              region.total_pob += att.pob_amount;
              region.total_visit += att.no_of_calls;
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

          all_visits.map(vis => {
            if (vis.hq_headquarter_id == headquarter.id) {
              headquarter.all_total_visit += vis.visit_count;
              area.all_total_visit += vis.visit_count;
              region.all_total_visit += vis.visit_count;
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
   * Download Excel For Executive Summary
   */
  download() {

    this.reportService.executive_summary_download(this.month + 1, this.year, this.zone_id).subscribe(
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
