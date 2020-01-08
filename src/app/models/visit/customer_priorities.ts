import {Model} from "../model";
import {Brand} from '../order/brand';
import {Priority} from './priority';

export class CustomerPriorities extends Model {

  priority_name: string;
  brand: Brand;
  priority: Priority;
  priority_id: number;
  brand_id = 0;

  constructor(info: any) {
    super(info.id);
    this.priority_name = info.priority_name;

    if (info.priority) {
      this.priority_id = info.priority.id;
      this.priority_name = info.priority.name;
      this.priority = new Priority(info.priority);
    }
    if (info.brand) {
      this.brand_id = info.brand.id;
      this.brand = new Brand(info.brand);
    }
  }
}
