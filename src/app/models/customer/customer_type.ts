import {Model} from "../model";
import {Grade} from "./grade";

export class CustomerType extends Model {

    name: string;
    grades: Grade[] = [];
    customer_count: number = 0;

    // for internal use
    brick_count: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        if (info.customer_count)
            this.customer_count = parseInt(info.customer_count);
        if (info.grades) {
            this.grades = info.grades.map(g => new Grade(g));
        } else {
            this.grades = [];
        }
    }

    get withNoAdded() {
        return "Bricks With No " + this.name;
    }
}
