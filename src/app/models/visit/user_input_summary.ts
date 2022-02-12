import {Model} from "../model";
import {VisitInput} from './visit_input';

export class UserInputSummary extends Model {

  input_id: number;
  total_used: number;
  user_id: number;
  full_name: string;
  month: number;
  base_input_name: string;
  product_type: string;
  input_name: string;
  user_id_input_id: string;
  used: number;

  constructor(info: any) {
    super(info.id);
    this.input_name = info.input_name;
    this.input_id = info.input_id;
    this.total_used = info.total_used;
    this.user_id = info.user_id;
    this.full_name = info.full_name;
    this.month = info.month;
    this.base_input_name = info.base_input_name;
    this.product_type = info.product_type;
    this.user_id_input_id = info.user_id_input_id;
    this.used = info.used;
  }
}
