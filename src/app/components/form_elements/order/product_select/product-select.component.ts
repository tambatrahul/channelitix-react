import {Component, Input} from "@angular/core";
import {CustomerService} from "../../../../services/customer.service";
import {BaseSelectComponent} from "../../base-select.component";
import {ProductService} from "../../../../services/product.service";

@Component({
    selector: 'product-select',
    templateUrl: 'product-select.component.html'
})
export class ProductSelectComponent extends BaseSelectComponent {

    /**
     * Title of input select field
     */
    @Input()
    title: string = "Select Product";

    /**
     * First value of options
     */
    @Input()
    first_value: string = "All";

    /**
     * Area id for filter
     */
    private _abbott: boolean = false;
    private _department_id: number = 0;

    /**
     * Synergy Filter
     *
     * @type {boolean}
     */
    @Input()
    set abbott(abbott: boolean) {
        this._abbott = abbott;
        this.fetch();
    }

  /**
   * Synergy Filter
   *
   * @type {number}
   */
  @Input()
  set department_id(department_id) {
    this._department_id = department_id;
    this.fetch();
  }

    get abbott(): boolean {
        return this._abbott;
    }

    /**
     * Role Select Component with AuthService
     */
    constructor(private productService: ProductService) {
        super();
    }

    /**
     * fetch customer grades from constants
     */
    fetch() {
        this.loading = true;
        if (this._department_id > 0) {
          this.productService.allProduct(this._department_id)
            .subscribe(
              response => {
                this.loading = false;
                this.models = response.products;
              },
              err => {
                this.loading = false;
              }
            );
        } else
        {
          this.productService.all(this._abbott)
            .subscribe(
              response => {
                this.loading = false;
                this.models = response.products;
              },
              err => {
                this.loading = false;
              }
            );
        }
    }
}
