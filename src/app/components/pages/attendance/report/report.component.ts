import {Component, Input, Output, EventEmitter} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {Attendance} from "../../../../models/attendance/attendance";
import {VisitInput} from "../../../../models/visit/visit_input";
import {AttendanceService} from "../../../../services/attendance.service";
import {Product} from "../../../../models/order/product";
import {VisitService} from "../../../../services/visit.service";
import {Visit} from "../../../../models/visit/visit";
import {Order} from "../../../../models/order/order";
import {OrderItem} from "../../../../models/order/order_item";
import {Report} from "../../../../models/attendance/report";

@Component({
    selector: 'report-component',
    templateUrl: 'report.component.html',
    styleUrls: ['report.component.less']
})
export class ReportComponent extends BaseAuthComponent {

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

    /**
     * form fields
     */
    _report_date: string;

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
     * Selected Synergy
     */
    selected_synergy_customer: Report;

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
     * inputs for
     * @type {Array}
     */
    public inputs: VisitInput[] = [];
    public products: Product[] = [];

    /**
     * Synergy flag
     * @type {boolean}
     */
    public flag_synergy:boolean = false

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
        this._report_date = moment(attendance.date, "YYYY-MM-DD").format("DD MMMM YYYY");
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
                }));
            },
            err => {
                this.loading = false;
            }
        )
    }

    /**
     * format data
     */
    formatData(visits: Visit[], orders: Order[]) {
        let self = this;
        let data = [];
        visits.map(function (visit) {
            // set inputs
            visit.inputs = self.inputs.map(input => new VisitInput(input));

            // set answers
            visit.input_answers.forEach(function (answer) {
                visit.inputs.forEach(function (input) {
                    if (input.id == answer.input_id) {
                        input.value = answer.value;
                        input.answer_id = answer.id
                    }
                });
            });

            // order setup
            let order = new Order({
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
                    order.delivered_by_user = o.delivered_by_user;
                }
            });

            // remove items not ordered
            if (self.editable == 'closed') {
                order.order_items = order.order_items.filter(function (item) {
                    return item.quantity > 0;
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
        let self = this;

        // format data
        let formatted_data = this.data.filter(function (d) {
            return d.order.total_amount > 0 || d.visit.total_inputs > 0 || d.order.id > 0;
        }).map(function (d) {
            if (d.customer.customer_type_id > 1 && !d.order.delivered_by) {
                error = true;
                d.error = true;

                if (d == self.selected_customer){
                    self.selected_customer = d;
                    // self.selected_synergy_customer = d;
                }
            }

            return {
                customer_id: d.customer.id,
                visit: d.visit.total_inputs > 0 ? d.visit : null,
                order: d.order.total_amount > 0 ? d.order : null
            };
        });

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
     * select Customer
     *
     * @param customer
     */
    selectCustomer(customer) {
        this.selected_customer = customer;

        // if(customer.synergy)
        //     this.selectSynergyCustomer(customer);
    }

    /**
     * select Synergy Customer
     *
     * @param customer
     */
    // selectSynergyCustomer(customer) {
    //     this.selected_synergy_customer = customer;
    // }

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
    // setSynergyDeliveredBy(customer_id) {
    //     this.selected_synergy_customer.order.delivered_by = customer_id;
    // }

    /**
     * add more customers
     */
    addMoreCustomer() {
        this.add_more_customer.emit();
    }
}
