import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {SubNameService} from '../../../../services/subname_service';
import { V2ProductService } from "app/services/v2/product.service";

@Component({
  selector: 'subname-select',
  templateUrl: 'subname-select.component.html',
  providers: [V2ProductService]
})
export class SubNameSelectComponent extends BaseSelectComponent {

  /**
   * Title of input select field
   */
  @Input()
  title: string = "Select Brand";

  /**
   * First value of options
   */
  @Input()
  first_value: string = "All";

  private _department_id: number = 0;


  /**
   * Department Filter
   *
   * @type {number}
   */
  @Input()
  set department_id(department_id) {
    this._department_id = department_id;
    this.fetch();
  }


  /**
   * Role Select Component with AuthService
   */
  constructor(private v2ProductService: V2ProductService) {
    super();
  }

  /**
   * fetch brands
   */
  fetch() {
    this.loading = true;
    this.v2ProductService.productPortfolioNames(this._department_id)
        .subscribe(
          response => {
            this.loading = false;
            this.models = response.portfolio_names;
          },
          err => {
            this.loading = false;
          }
        );
  }
}
