import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {Visit} from "../../../../models/visit/visit";
import {VisitService} from "../../../../services/visit.service";
import {AppConstants} from '../../../../app.constants';
import {Brick} from '../../../../models/territory/brick';
import {InvoiceDetail} from '../../../../models/SAP/invoice_detail';
declare let jQuery: any;

@Component({
  selector: 'user-visit-list',
  templateUrl: 'user_visit_list.component.html',
  styleUrls: ['user_visit_list.component.less']
})
export class UserVisitListComponent extends BaseAuthComponent {


  /**
   * selected visit id
   */
  selectedVisitId: number;

  // _user: User;
  // @Input()
  // set user(user) {
  //   this._user = user;
  //   this.fetch();
  // }


  /**
   * month for report
   */
  @Input()
  month: number;

  /**
   * year for report
   */
  @Input()
  year: number;

  /**
   * date for report
   */
  _date: number = 0;
  @Input()
  set date(date: number) {
    this._date = date;
    this.fetchData();
  }

  _user: User;
  @Input()
  set user(user) {
    this._user = user;
    this.fetchData();
  }

  /**
   * customer_type_id for report
   */
  _customer_type_id: number = 0;
  @Input()
  set customer_type_id(customer_type_id: number) {
    this._customer_type_id = customer_type_id;
    this.fetchData();
  }

  /**
   * get title of table
   * @returns {string}
   */
  get title(): string {
    return this._date + " " + moment().year(this.year).month(this.month).format("MMMM, YYYY") + " for " + this._user.full_name;
  }

  /**
   * visits
   *
   * @type {{}}
   */
  public visits: Visit[] = [];

  customer_count: number;
  customer_total: number = 0;
  customer_stockist: number = 0;
  customer_semi: number = 0;
  customer_retailer: number = 0;
  customer_hub_chemist: number = 0;
  customer_doctor: number = 0;
  customer_stockist_salesman: number= 0;
  customer_otc_semi: number = 0;
  customer_type: number = 0;

  /**
   * Visit
   *
   * @param visitService
   * @param _service
   */
  constructor(private visitService: VisitService, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
  }

  reset() {
    this.customer_total = 0;
    this.customer_stockist = 0;
    this.customer_semi = 0;
    this.customer_retailer = 0;
    this.customer_hub_chemist = 0;
    this.customer_doctor = 0;
    this.customer_stockist_salesman = 0;
    this.customer_otc_semi = 0;
  }
  /**
   * fetch server data for visits
   */
  fetchData = AppConstants.debounce(function() {
    const self = this;
    self.reset();
    if ((self.month || self.month == 0) && self.year && self._user && self._date > 0) {
      self.loading = true;
      self.visitService.forUser(self._user.id, self.month + 1, self.year, self._date, self._customer_type_id).subscribe(
        response => {
          self.visits = response.visits.map(function (vis, index) {
            let visit_de = new Visit(vis);
            self.customer_total += visit_de.customer_count;
            self.customer_type = visit_de.customer_type_id;

            /**
             * All Customers counts
             */
            if (self.customer_type == 1) {
              self.customer_stockist += visit_de.customer_count;
            }

            if (self.customer_type == 2) {
              self.customer_semi += visit_de.customer_count;
            }

            if (self.customer_type == 3) {
              self.customer_retailer += visit_de.customer_count;
            }

            if (self.customer_type == 4) {
              self.customer_hub_chemist += visit_de.customer_count;
            }

            if (self.customer_type == 5) {
              self.customer_doctor += visit_de.customer_count;
            }

            if (self.customer_type == 6) {
              self.customer_stockist_salesman += visit_de.customer_count;
            }

            if (self.customer_type == 7) {
              self.customer_otc_semi += visit_de.customer_count;
            }


            return visit_de;
          });

          self.loading = false;
        },
        err => {
          self.loading = false;
        }
      )
    }
  }, 1000, false);


  /**
   * select visit
   *
   *
   * @param visit_id
   */
  selectVisit(visit_id: number) {
    this.selectedVisitId = visit_id;
  }
}
