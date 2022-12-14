import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseAuthComponent} from '../../../base/base_auth.component';
import {Router} from '@angular/router';
import {AuthService} from '../../../../services/AuthService';
import * as moment from 'moment';
import {Attendance} from '../../../../models/attendance/attendance';
import {VisitInput} from '../../../../models/visit/visit_input';
import {AttendanceService} from '../../../../services/attendance.service';
import {Product} from '../../../../models/order/product';
import {VisitService} from '../../../../services/visit.service';
import {Visit} from '../../../../models/visit/visit';
import {Order} from '../../../../models/order/order';
import {OrderItem} from '../../../../models/order/order_item';
import {Report} from '../../../../models/attendance/report';
import {Brand} from '../../../../models/order/brand';
import {Priority} from '../../../../models/visit/priority';
import {CustomerPriorities} from '../../../../models/visit/customer_priorities';
import {UserInput} from '../../../../models/V2/user/user_input';
import {FormComponent} from '../../../base/form.component';
declare let swal: any;


@Component({
  selector: 'report-component',
  templateUrl: 'report.component.html',
  styleUrls: ['report.component.less']
})
export class ReportComponent extends FormComponent {

  public brand_id: number = 0;
  customer_priorities: CustomerPriorities[] = [];
  /**
   * date of attendance
   */
  @Input()
  date: string;

  /**
   * editable
   */
  @Input()
  editable: string;

  /**
   * saved
   */
  saved: boolean = false;

  reporting_status: string = '';
  mobile_number: number = 0;

  classifications = [{'key': 'core', 'value': 'Core'}, {'key': 'super_core', 'value': 'Super Core'}];

  /**
   * form fields
   */
  _report_date: string;
public mobile_valid: boolean = false;
  /**
   * customer list
   *
   * @type {Array}
   */
  data = [];

  /**
   * selected Customer
   */
  selected_customer: Report;

  /**
   * tour creation selection
   *
   * @type {EventEmitter}
   */
  @Output()
  attendance_confirmed = new EventEmitter();

  /**
   * tour creation selection
   *
   * @type {EventEmitter}
   */
  @Output()
  add_more_customer = new EventEmitter();

  /**
   * selected value
   */
  @Input()
  value: number = 0;

  /**
   * inputs for
   * @type {Array}
   */
  public inputs: VisitInput[] = [];
  public quantities: UserInput[] = [];
  public products: Product[] = [];
  public brands: Brand[] = [];

  @Input()
  set refresh(value) {
    this.fetchVisits();
  }

  /**
   * Input attendance
   *
   * @param attendance
   */
  @Input()
  set attendance(attendance: Attendance) {
    this.date = attendance.date;
    this.reporting_status = attendance.reporting_status;
    this._report_date = moment(attendance.date, 'YYYY-MM-DD').format('DD MMMM YYYY');
    this.fetchVisits();
  }

  /**
   * Reporting Constructor
   *
   * @param visitService
   * @param attendanceService
   * @param _router
   * @param _service
   */
  constructor(private visitService: VisitService, private attendanceService: AttendanceService,
              public _router: Router, public _service: AuthService) {
    super(_service);
  }

  /**
   * initialize masters
   */
  ngOnInit() {
    this.fetchMasters();
  }

  /**
   * load customerTypes
   */
  fetchMasters() {
    this.loading = true;
    this.attendanceService.masters().subscribe(
      response => {
        this.loading = false;
        this.inputs = response.inputs;
        this.products = response.products.map(function (product) {
          return new Product(product);
        });
        this.brands = response.brands.map(function (brand) {
          return new Brand(brand);
        });
        this.fetchVisits();
      },
      err => {
        this.loading = false;
      }
    );

  }

  /**
   * fetch visits and orders for day
   */
  fetchVisits() {
    this.loading = true;
    this.attendanceService.reportForDate(this.date).subscribe(
      response => {
        this.loading = false;
        this.formatData(response.visits.map(function (visit) {
          return new Visit(visit);
        }), response.orders.map(function (order) {
          return new Order(order);
        }), response.priorities.map(function (priority) {
          return new Priority(priority);
        }));
        this.saved = false;
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * format data
   */
  formatData(visits: Visit[], orders: Order[], priorities: Priority[]) {
    const self = this;
    const data = [];
    visits.map(function (visit) {
      // set inputs
      visit.inputs = self.inputs.map(input => new VisitInput(input));

      // set answers
      visit.input_answers.forEach(function (answer) {
        visit.inputs.forEach(function (input) {
          if (input.id == answer.input_id) {
            input.value = answer.value;
            input.answer_id = answer.id;
          }
        });
      });

      // order setup
      const order = new Order({
        order_items: self.products.map(function (product) {

          return new OrderItem({
            product_id: product.id,
            product: product,
            uom_id: product.uoms[0].id,
            uom: product.uoms[0],
            unit_price: product.uoms[0].unit_price
          });
        })
      });

      // add order item values
      orders.forEach(function (o) {
        if (o.customer_id == visit.customer_id) {
          o.order_items.forEach(function (item) {

            order.order_items.forEach(function (i) {
              if (i.product_id == item.product_id) {
                i.quantity = item.quantity;
                i.id = item.id;
              }
            });
          });
          order.id = o.id;
          order.delivered_by = o.delivered_by;
          order.delivered_by_synergy = o.delivered_by_synergy;
          order.delivered_by_user = o.delivered_by_user;
          order.delivered_by_synergy_user = o.delivered_by_synergy_user;
        }
      });

      // remove items not ordered
      if (self.editable === 'closed') {
        order.order_items = order.order_items.filter(function (item) {
          return item.quantity > 0;
        });
      }

      // setting priorities
      if (self.editable === 'open' && visit.customer_priorities.length === 0) {
          visit.customer_priorities = [];
          priorities.forEach(function (priority) {
            visit.customer_priorities.push(new CustomerPriorities({
              'priority': priority
            }));
          });
      }
      // push data to array
      data.push({
        customer: visit.customer,
        order: order,
        visit: new Visit(visit),
        error: false
      });
    });

    this.data = data;
    this.selectCustomer(data[0]);


  }

  /**
   * Save Visit
   */
  save() {
    this.loading = true;
    let error = false;
    const self = this;

    // format data
    const formatted_data = this.data.filter(function (d) {
      return d.order.total_amount > 0 || d.visit.total_inputs > 0 || d.order.id > 0 || d.customer.mobile > 0;
    }).map(function (d) {
      if (d.customer.customer_type_id > 1
        && ((d.order.isNonSynergy && !d.order.delivered_by)
          || (d.order.isSynergy && !d.order.delivered_by_synergy))) {
        error = true;
        d.error = true;

        if (d === self.selected_customer) {
          self.selected_customer = d;
        }
      }

      return {
        customer_id: d.customer.id,
        mobile: d.customer.mobile,
        classification: d.customer.classification,
        visit: (d.visit.total_inputs > 0 || d.visit.customer_priorities.length > 0) ? d.visit : null,
        order: d.order.total_amount > 0 ? d.order : null
      };
    });

    this.attendanceService.update_mobile_while_reporting({customers: formatted_data}).subscribe(
      response => {
        this.loading = false;
      },
      err => {
      }
    );

    if (!error) {
      this.attendanceService.report(this.date, {customers: formatted_data}).subscribe(
        response => {
          this.loading = false;
          this.saved = true;

        },
        err => {
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
  }

  /**
   * attendance confirmed
   */
  submit() {
    this.attendanceService.report_submit(this.date).subscribe(
      response => {
        this.loading = false;
        this.attendance_confirmed.emit();
      },
      err => {
        this.loading = false;
      }
    );
  }


  /**
   * set brand by id
   * @param data
   */
  setBrandIdBy(data) {
    this.selected_customer.visit.customer_priorities = this.selected_customer.visit.customer_priorities.map(function (cp) {
      if (cp.priority_id === data.priority.priority_id) {
        cp.brand_id = data.brand_id;
      }
      return cp;
    });
  }
  /**
   * select Customer
   *
   * @param customer
   */
  selectCustomer(customer) {
    this.selected_customer = customer;
  }

  /**
   * set delivered by id
   * @param customer_id
   */
  setDeliveredBy(customer_id) {
    this.selected_customer.order.delivered_by = customer_id;
  }

  /**
   * set synergy delivered by id
   * @param customer_id
   */
  setSynergyDeliveredBy(customer_id) {
    this.selected_customer.order.delivered_by_synergy = customer_id;
  }

  /**
   * add more customers
   */
  addMoreCustomer() {
    this.add_more_customer.emit();
  }

  /**
   * reset save
   */
  resetSave() {
    this.saved = false;
  }

  onMobileChange(value) {
    this.mobile_number = value;
    if (this.mobile_number >= 6000000000 && this.mobile_number <= 9999999999 || this.mobile_number == null ) {
      this.mobile_valid = false;
    } else {
      this.mobile_valid = true;
    }
  }
}
