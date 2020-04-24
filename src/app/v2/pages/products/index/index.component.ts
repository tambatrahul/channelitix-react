import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {Product} from "../../../../models/order/product";
import {ProductService} from "../../../../services/product.service";
import {ListComponent} from "../../../../components/base/list.component";
import * as moment from 'moment';
declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html'
})
export class ProductComponent extends ListComponent {

  /**
   * products
   *
   * @type {Array}
   */
  public products: Product[] = [];

  public department_id: number = 0;

  /**
   * Product Component Constructor
   */
  constructor(private productService: ProductService, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load
   */
  ngOnInit() {

    super.ngOnInit();
    if (this._service.user.department.length > 0)
      this.department_id = this._service.user.department[0].pivot.department_id;

    this.fetch();
  }

  /**
   * fetch products from server
   */
  fetch() {
    this.loading = true;
    this.productService.allProduct(this.department_id).subscribe(
      response => {

        // convert to models
        this.products = response.products.map(function (product, index) {
          return new Product(product);
        });

        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );
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
