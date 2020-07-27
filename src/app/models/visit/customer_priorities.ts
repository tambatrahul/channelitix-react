import {Model} from "../model";
import {Brand} from '../order/brand';
import {Priority} from './priority';

export class CustomerPriorities extends Model {

  name: string;
  brand: Brand;
  priority: Priority;
  priority_id: number;
  brand_id = 0;
  pri_brand_id : number;

  constructor(info: any) {
    super(info.id);
    this.pri_brand_id = info.brand_id;
    if (info.priority) {
      this.priority_id = info.priority.id;
      this.name = info.priority.name;
      this.priority = new Priority(info.priority);
    }
    if (info.brand) {
      this.brand_id = info.brand.id;
      this.brand = new Brand(info.brand);
    }
  }
}
