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

    /**
     * get self clone
     *
     * @returns {CustomerType}
     */
    clone() {
        let grades: Grade[] = [];
        for (let grade of grades) {
            grades.push(new Grade(grade));
        }
        return new CustomerType({
            name: this.name,
            grades: grades,
            customer_count: this.customer_count
        })
    }
}
