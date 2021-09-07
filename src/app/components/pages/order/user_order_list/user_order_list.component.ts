import {Component, Input} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {OrderService} from "../../../../services/order.service";
import {Order} from "../../../../models/order/order";
import {AppConstants} from '../../../../app.constants';
declare let jQuery: any;

@Component({
    selector: 'user-order-list',
    templateUrl: 'user_order_list.component.html',
    styleUrls: ['user_order_list.component.less']
})
export class UserOrderListComponent extends BaseAuthComponent {

    /**
     * selected order id
     */
    selectedOrderId: number;
    public btn_loading: boolean = false;
    public _department_id: number = 0;
    public _brand_id: number = 0;

    _user: User;
    @Input()
    set user(user) {
        this._user = user;
        this.fetchData();
    }

  /**
   * Department Filter
   *
   * @type {number}
   */
  @Input()
  set department_id(department_id) {
    this._department_id = department_id;
    this.fetchData();
  }


  /**
   * Brand Filter
   *
   * @type {number}
   */
  @Input()
  set brand_id(brand_id) {
    this._brand_id = brand_id;
    this.fetchData();
  }

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
    _date: number;
    @Input()
    set date(date: number) {
        this._date = date;
        this.fetchData();
    }

    /**
     * customer_type_id filter
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
     * users
     *
     * @type {{}}
     */
    public orders: Order[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private orderService: OrderService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * fetch server data for visits
     */
    fetchData = AppConstants.debounce(function() {
      const self = this;
        if ((self.month || self.month == 0) && self.year && self._user && self._date) {
          self.loading = true;
          self.orderService.forUser(self._user.id, self.month + 1, self.year,
            self._date, self._department_id, self._brand_id, self._customer_type_id).subscribe(
                response => {
                  self.orders = response.orders.map(order => new Order(order));
                    if (self._service.user.username == 'abbottadmin')
                      self.orders = self.orders.filter(order => {
                            if (order.isSynergy) {
                                return true;
                            }
                            return false;
                        });
                  self.loading = false;
                },
                err => {
                  self.loading = false;
                }
            );
        }
    }, 1000, false);

    /**
     * select order
     *
     * @param order_id
     */
    selectOrder(order_id: number) {
        this.selectedOrderId = order_id;
    }

    /**
     * Download Excel For Bricks
     */
    excel_download() {
        this.btn_loading = true;
        this.orderService.excel_download(this._user.id, this.month + 1, this.year, this._date).subscribe(
            response => {
                let blob: Blob = response.blob();

                // Doing it this way allows you to name the file
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "Orders.xls";
                link.click();
                this.btn_loading = false;
            },
            err => {
                this.btn_loading = false;
            }
        );
    }
}
