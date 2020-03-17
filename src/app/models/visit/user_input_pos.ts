import {Model} from "../model";
import {VisitInput} from './visit_input';

export class UserInputPos extends Model {

  input_id: number;
  quantity_received: number;
  user_id: number;
  month_of_use: string;
  batch_no: string;
  product_type: string;
  quantity_dispatched: number;
  product_name: string;

  constructor(info: any) {
    super(info.id);
    this.product_name = info.product_name;
    this.input_id = info.input_id;
    this.quantity_received = info.quantity_received;
    this.user_id = info.user_id;
    this.month_of_use = info.month_of_use;
    this.batch_no = info.batch_no;
    this.product_type = info.product_type;
    this.quantity_dispatched = info.quantity_dispatched;
  }
}
