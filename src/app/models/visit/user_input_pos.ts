import {Model} from "../model";
import {UserInputSummary} from './user_input_summary';


export class UserInputPos extends Model {

  input_id: number;
  quantity_received: number;
  user_id: number;
  month_of_use: string;
  batch_no: string;
  product_type: string;
  quantity_dispatched: number;
  product_name: string;
  full_name: string;
  id_input_id: string;
  name: string;
  code: string;
  totalDispatched: number;
  totalReturned: number;
  totalReceived: number;
  totalUsed: number;
  totalBalance: number;
  totalYtdBalance: number;
  monthly: UserInputSummary[];

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
    this.full_name = info.full_name;
    this.id_input_id = info.id_input_id;
    this.name = info.name;
    this.code = info.code;
    this.totalDispatched = info.totalDispatched;
    this.totalReturned = info.totalReturned;
    this.totalReceived = info.totalReceived;
    this.totalUsed = info.totalUsed;
    this.totalYtdBalance = info.totalYtdBalance;
    this.totalBalance = info.totalBalance;

    if (info.monthly)
      this.monthly = info.monthly.map(month => new UserInputSummary(month));
  }
}
