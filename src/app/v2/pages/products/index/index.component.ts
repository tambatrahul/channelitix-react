import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {Product} from "../../../../models/order/product";
import {ProductService} from "../../../../services/product.service";
import {ListComponent} from "../../../../components/base/list.component";
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

  /**
   * Product Component Constructor
   */
  constructor(private productService: ProductService, public _service: AuthService) {
    super(_service);
  }

  /**
   * fetch products from server
   */
  fetch() {
    this.loading = true;
    this.productService.all().subscribe(
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
}
