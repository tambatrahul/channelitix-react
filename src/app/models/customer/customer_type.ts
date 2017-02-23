import {Model} from "../model";
import {Grade} from "./grade";

export class CustomerType extends Model {

  name: string;
  grades: Grade[] = [];
  customer_count: number = 0;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.grades = info.grades;
    this.customer_count = info.customer_count
  }
}
