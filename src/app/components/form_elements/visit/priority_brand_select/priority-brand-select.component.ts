import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {BrandService} from "../../../../services/brand.service";
import {Brand} from '../../../../models/order/brand';

@Component({
  selector: 'priority-brand-select',
  templateUrl: 'priority-brand-select.component.html'
})
export class PriorityBrandSelectComponent extends BaseSelectComponent {

  /**
   * Title of input select field
   */
  @Input()
  models: Brand[] = [];

  /**
   * First value of options
   */
  @Input()
  first_value: string = "Select Brand";


  /**
   * Role Select Component with AuthService
   */
  constructor(private brandService: BrandService) {
    super();
  }

  fetch() {
  }
}
