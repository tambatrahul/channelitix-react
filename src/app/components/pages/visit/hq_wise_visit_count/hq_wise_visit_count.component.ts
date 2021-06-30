import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {ReportService} from "../../../../services/report.service";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Headquarter} from "../../../../models/territory/headquarter";
import {Visit} from "../../../../models/visit/visit";
import * as moment from "moment";
import {Customer} from "../../../../models/customer/customer";
import {Region} from "../../../../models/territory/region";
declare let jQuery: any;

@Component({
    templateUrl: 'hq_wise_visit_count.component.html',
    styleUrls: ['hq_wise_visit_count.component.less']
})
export class HQWiseVisitComponent extends ListComponent {

    excel_loaded: boolean = false;
    /**
     * bricks
     *
     * @type {{}}
     */
    public regions = [];

    /**
     * customer types
     *
     * @type {Array}
     */
    public customer_types: CustomerType[] = [];

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;
     zone_id: number = 0;
     department_id: number = 0;
     training_id: number= 0;
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
      if (this._service.user.hq_zone_id)
        this.zone_id = this._service.user.hq_zone_id;
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();

      if(this._service.user.role_str == 'COUNTRY_MNG')
        this.zone_id = 1;
    }

    /**
     * load users for logged in user
     */
    fetch() {
        if ((this.month || this.month == 0) && this.year) {
            this.loading = true;
            this.reportService.hq_wise_visit_counts(this.month + 1, this.year, this.zone_id).subscribe(
                response => {
                    this.loading = false;

                    // get regions
                    this.regions = response.regions.map(region => new Region(region));

                    // prepare headquarters
                    let headquarters = response.headquarters.map(head => new Headquarter(head));

                    // prepare customers
                    let customers = response.customers.map(cus => new Customer(cus));
                    let visits = response.visits.map(visit => new Visit(visit));

                    // get v2 and v3 visits
                    let v2_v3_visits = response.v2_v3_visits.map(visit => new Visit(visit));

                    // prepare customer types
                    let customer_types = response.customer_types.map(ct => new CustomerType(ct));
                    this.mapTypes(customer_types);

                    // prepare data for table
                    this.prepareData(visits, customers, v2_v3_visits);
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * map targets
     *
     * @param customer_types
     */
    mapTypes(customer_types: CustomerType[]) {
        this.regions.map(region => {
            region.areas.map(area => {
                area.headquarters.map(headquarter => {
                    headquarter.customer_types = customer_types.map(ct => new CustomerType(ct));
                });
                area.customer_types = customer_types.map(ct => new CustomerType(ct));
            });
            region.customer_types = customer_types.map(ct => new CustomerType(ct));
        });
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
                                            grade.visit_count += vis.visit_count

                                    // if (grade.id == vis.grade_id && vis.doctor_speciality == 'General Practitioner'){
                                    //         grade.gp_visit_count += vis.visit_count;
                                    //     }

                                    if (grade.id == vis.grade_id && vis.doctorGroupName == 'Consultant Physician' && vis.customer_type_id == 5){
                                            grade.phy_visit_count += vis.visit_count;
                                        }

                                    if (grade.id == vis.grade_id && vis.doctorGroupName == 'Psychiatrist' && vis.customer_type_id == 5){
                                            grade.psy_visit_count += vis.visit_count;
                                        }

                                    // if (grade.id == vis.grade_id && vis.doctor_speciality != 'General Practitioner' && vis.customer_type_id == 5) {
                                    //         grade.not_gp_visit_count += vis.visit_count;
                                    //     }

                                    if (grade.id == vis.grade_id && vis.doctorGroupName != 'Consultant Physician' && vis.doctorGroupName != 'Psychiatrist' && vis.customer_type_id == 5){
                                            grade.not_phy_psy_visit_count += vis.visit_count;
                                        }

                                });
                            });

                            area.customer_types.map(ct => {
                                ct.grades.map(grade => {
                                    if (grade.id == vis.grade_id)
                                        grade.visit_count += vis.visit_count;

                                    // if (grade.id == vis.grade_id && vis.doctor_speciality == 'General Practitioner'){
                                    //     grade.gp_visit_count += vis.visit_count;
                                    // }

                                    if (grade.id == vis.grade_id && vis.doctorGroupName == 'Consultant Physician' && vis.customer_type_id == 5){
                                        grade.phy_visit_count += vis.visit_count;
                                    }

                                    // if (grade.id == vis.grade_id && vis.doctor_speciality == 'Psychiatrist' && vis.customer_type_id == 5){
                                    //     grade.psy_visit_count += vis.visit_count;
                                    // }

                                    if (grade.id == vis.grade_id && vis.doctorGroupName != 'General Practitioner' && vis.customer_type_id == 5) {
                                        grade.not_gp_visit_count += vis.visit_count;
                                    }

                                    if (grade.id == vis.grade_id && vis.doctorGroupName != 'Consultant Physician' && vis.doctorGroupName != 'Psychiatrist' && vis.customer_type_id == 5){
                                        grade.not_phy_psy_visit_count += vis.visit_count;
                                    }
                                });
                            });
                            region.customer_types.map(ct => {
                                ct.grades.map(grade => {
                                    if (grade.id == vis.grade_id)
                                        grade.visit_count += vis.visit_count;

                                    // if (grade.id == vis.grade_id && vis.doctor_speciality == 'General Practitioner'){
                                    //     grade.gp_visit_count += vis.visit_count;
                                    // }

                                    if (grade.id == vis.grade_id && vis.doctorGroupName == 'Consultant Physician' && vis.customer_type_id == 5){
                                        grade.phy_visit_count += vis.visit_count;
                                    }

                                    if (grade.id == vis.grade_id && vis.doctorGroupName == 'Psychiatrist' && vis.customer_type_id == 5){
                                        grade.psy_visit_count += vis.visit_count;
                                    }

                                    // if (grade.id == vis.grade_id && vis.doctor_speciality != 'General Practitioner' && vis.customer_type_id == 5) {
                                    //     grade.not_gp_visit_count += vis.visit_count;
                                    // }

                                    if (grade.id == vis.grade_id && vis.doctorGroupName != 'Consultant Physician' && vis.doctorGroupName != 'Psychiatrist' && vis.customer_type_id == 5){
                                        grade.not_phy_psy_visit_count += vis.visit_count;
                                    }

                                });
                            });
                        }
                    });

                    customers.map(cus => {
                        if (cus.hq_headquarter_id == headquarter.id) {
                            headquarter.customer_types.map(ct => {
                                ct.grades.map(grade => {
                                    if (grade.id == cus.grade_id)
                                        grade.customer_count += cus.visit_count;

                                    // if (grade.id == cus.grade_id && cus.doctor_speciality == 'General Practitioner' && cus.customer_type_id == 5 ) {
                                    //     grade.gp_customer_count +=cus.visit_count;
                                    // }

                                    if (grade.id == cus.grade_id && cus.doctorGroupName == 'Consultant Physician' && cus.customer_type_id == 5 ) {
                                        grade.phy_customer_count +=cus.visit_count;
                                    }

                                    if (grade.id == cus.grade_id && cus.doctorGroupName == 'Psychiatrist' && cus.customer_type_id == 5 ) {
                                        grade.psy_customer_count +=cus.visit_count;
                                    }

                                    // if (grade.id == cus.grade_id && cus.doctor_speciality != 'General Practitioner' && cus.customer_type_id == 5 ) {
                                    //     grade.not_gp_customer_count +=cus.visit_count;

                                    // }

                                    if (grade.id == cus.grade_id && cus.doctorGroupName != 'Consultant Physician' && cus.doctorGroupName != 'Psychiatrist'  && cus.customer_type_id == 5){
                                        grade.not_phy_psy_customer_count += cus.visit_count;
                                    }


                                });
                            });
                            area.customer_types.map(ct => {
                                ct.grades.map(grade => {
                                    if (grade.id == cus.grade_id)
                                        grade.customer_count += cus.visit_count;

                                    // if (grade.id == cus.grade_id && cus.doctor_speciality == 'General Practitioner' && cus.customer_type_id == 5 ) {
                                    //     grade.gp_customer_count +=cus.visit_count;
                                    // }

                                    if (grade.id == cus.grade_id && cus.doctorGroupName == 'Consultant Physician' && cus.customer_type_id == 5 ) {
                                        grade.phy_customer_count +=cus.visit_count;
                                    }

                                    if (grade.id == cus.grade_id && cus.doctorGroupName == 'Psychiatrist' && cus.customer_type_id == 5 ) {
                                        grade.psy_customer_count +=cus.visit_count;
                                    }

                                    // if (grade.id == cus.grade_id && cus.doctor_speciality != 'General Practitioner' && cus.customer_type_id == 5 ) {
                                    //     grade.not_gp_customer_count +=cus.visit_count;

                                    // }

                                    if (grade.id == cus.grade_id && cus.doctorGroupName != 'Consultant Physician' && cus.doctorGroupName != 'Psychiatrist'  && cus.customer_type_id == 5){
                                        grade.not_phy_psy_customer_count += cus.visit_count;
                                    }

                                });
                            });
                            region.customer_types.map(ct => {
                                ct.grades.map(grade => {
                                    if (grade.id == cus.grade_id)
                                        grade.customer_count += cus.visit_count

                                    // if (grade.id == cus.grade_id && cus.doctor_speciality == 'General Practitioner' && cus.customer_type_id == 5 ) {
                                    //     grade.gp_customer_count +=cus.visit_count;
                                    // }

                                    if (grade.id == cus.grade_id && cus.doctorGroupName == 'Consultant Physician' && cus.customer_type_id == 5 ) {
                                        grade.phy_customer_count +=cus.visit_count;
                                    }

                                    if (grade.id == cus.grade_id && cus.doctorGroupName == 'Psychiatrist' && cus.customer_type_id == 5 ) {
                                        grade.psy_customer_count +=cus.visit_count;
                                    }

                                    // if (grade.id == cus.grade_id && cus.doctor_speciality != 'General Practitioner' && cus.customer_type_id == 5 ) {
                                    //     grade.not_gp_customer_count +=cus.visit_count;
                                    // }

                                    if (grade.id == cus.grade_id && cus.doctorGroupName != 'Consultant Physician' && cus.doctorGroupName != 'Psychiatrist'  && cus.customer_type_id == 5){
                                        grade.not_phy_psy_customer_count += cus.visit_count;
                                    }
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

        setTimeout(() => {
            if (!this.excel_loaded) {
                this.excel_loaded = true;
                jQuery(".visit_table").tableExport({
                    formats: ['xlsx'],
                    bootstrap: true,
                    position: "top"
                });
            }
        }, 1000);
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
   * customer type changed
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.zone_id = zone_id;
    this.fetch();
  }

  /**
   * @param department_id
   */

  departmentChanged(department_id) {
      this.department_id = department_id;
      this.fetch();
  }
}
