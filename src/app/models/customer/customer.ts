import {Model} from "../model";
import {CustomerType} from "./customer_type";
import {Grade} from "./grade";

export class Customer extends Model {

  firm_name: string;
  owner_name: string;
  email: string;
  mobile: string;
  customer_type: CustomerType;
  grade_id: number;
  grade: Grade;
  status: string;
  total_customers: number = 0;
  brick_id: number;

  constructor(info: any) {
    super(info.id);
    this.firm_name = info.firm_name;
    this.owner_name = info.owner_name;
    this.mobile = info.mobile;
    this.email = info.email;
    this.customer_type = info.customer_type;
    this.grade_id = info.grade_id;
    this.grade = info.grade;
    this.status = info.status;
    this.total_customers = info.total_customers;
    this.brick_id = info.brick_id;
  }
}
