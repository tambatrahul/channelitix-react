import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {Attendance} from "../../../../models/attendance/attendance";
import {Customer} from "../../../../models/customer/customer";
import {VisitInput} from "../../../../models/visit/visit_input";
import {AttendanceService} from "../../../../services/attendance.service";
import {Product} from "../../../../models/order/product";
import {VisitService} from "../../../../services/visit.service";
import {Visit} from "../../../../models/visit/visit";
import {Order} from "../../../../models/order/order";
import {OrderItem} from "../../../../models/order/order_item";

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
    selected_customer: {};

    /**
     * inputs for
     * @type {Array}
     */
    public inputs: VisitInput[] = [];
    public products: Product[] = [];

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
     * fetch visits for day
     */
    fetchVisits() {
        this.loading = true;
        this.visitService.for_date(this.date).subscribe(
            response => {
                this.loading = false;
                this.formatData(response.visits.map(function (visit) {
                    return new Visit(visit);
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
    formatData(visits) {
        let self = this;
        let data = [];
        visits.map(function (visit) {
            visit.inputs = self.inputs.map(input => new VisitInput(input));
            data.push({
                customer: visit.customer,
                order: new Order({
                    order_items: self.products.map(function (product) {
                        return new OrderItem({
                            product_id: product.id,
                            product: product,
                            uom_id: product.uoms[0].id,
                            uom: product.uoms[0],
                            unit_price: product.uoms[0].unit_price
                        });
                    })
                }),
                visit: new Visit(visit)
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
    }

    /**
     * select Customer
     *
     * @param customer
     */
    selectCustomer(customer: Customer) {
        this.selected_customer = customer;
    }

    /**
     * when the customer is to be added
     *
     * @param customer
     */
    addCustomer(customer: Customer) {
        this.data.push({
            customer: customer,
            inputs: this.inputs.map(input => Object.assign({}, input)),
            products: this.products.map(product => Object.assign({}, product))
        });
    }

    /**
     * when the customer is to be remove
     *
     * @param customer
     */
    removeCustomer(customer: Customer) {
        this.data = this.data.filter(function (cus) {
            return cus.id != customer.id;
        });
    }
}
