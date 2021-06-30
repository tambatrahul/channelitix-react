import {Model} from "../model";
import {Grade} from "./grade";

export class CustomerType extends Model {

    name: string;
    grades: Grade[] = [];
    customer_count: number = 0;
    doctor_speciality: string;
    doctor_group_name: string;


    // for internal use
    brick_count: number = 0;
    v2_count: number = 0;
    v3_count: number = 0;
    hq_headquarter_id: number = 0;
    visit_count: number = 0;
    attendance_count: number = 0;
    order_count: number = 0;
    total_pob: number = 0;
    total_call_avg: number = 0;
    total_productive_avg: number = 0;
    distinct_order_count: number =0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.doctor_speciality = info.doctor_speciality;
        this.doctor_group_name = info.doctor_group_name;
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

    /**
     * Customer count for type A customers
     * @returns {number}
     */
    get aCustomerCount() {
        let count = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('A') >= 0) {
                count += grade.customer_count;
            }
        });
        return count;
    }

    /**
     * Customer count for type A customers
     * @returns {number}
     */
    get bCustomerCount() {
        let count = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('B') >= 0) {
                count += grade.customer_count;
            }
        });
        return count;
    }

    /**
     * Visit count for type A customers
     * @returns {number}
     */
    get aVisitCount() {
        let count = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('A') >= 0) {
                count += grade.visit_count;
            }
        });
        return count;
    }

    /**
     * Get all Visit count for type A customers
     * @returns {number}
     */
     get aAllVisitCount() {
        let count_all_a = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('A') >= 0) {
                count_all_a += grade.all_visit_count;
            }
        });
        return count_all_a;
    }

    /**
     * Visit count for type B customers
     *
     * @returns {number}
     */
    get bVisitCount() {
        let count = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('B') >= 0) {
                count += grade.visit_count;
            }
        });
        return count;
    }

    /**
     * Get All Visit count for type B customers
     *
     * @returns {number}
     */
    get bAllVisitCount() {
        let count_all_b = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('B') >= 0) {
                count_all_b += grade.all_visit_count;
            }
        });
        return count_all_b;
    }

    /**
     * Visit count for customers
     * @returns {number}
     */
    get visitCount() {
        let count = 0;
        this.grades.map(grade => {
            count += grade.visit_count;
        });
        return count;
    }

    /**
     * Gives total visit count for Customers
     * @returns {number}
     */
    get allVisitCount() {
        let count_all = 0;
        this.grades.map(grade => {
            count_all += grade.all_visit_count;
        });
        return count_all;
    }

    /**
     * general practitioner visit count
     * @returns {number}
     */

    get gpVisitCount() {
        let gp_count = 0;
        this.grades.map(grade => {
                gp_count +=grade.gp_visit_count;
        });
        return gp_count;
    }

    /**
     * psychiatrist visit count
     * @returns {number}
     */

    get psyVisitCount() {
        let psy_count = 0;
        this.grades.map(grade => {
                psy_count +=grade.psy_visit_count;
        });
        return psy_count;
    }

    /**
     * physician visit count
     * @returns {number}
     */

     get phyVisitCount() {
        let phy_count = 0;
        this.grades.map(grade => {
            phy_count +=grade.phy_visit_count;
        });
        return phy_count;
    }

    /**
     * other than general practitioner visit count
     * @returns {number}
     */

     get notgpVisitCount() {
        let not_gp_count = 0;
        this.grades.map(grade => {
                not_gp_count +=grade.not_gp_visit_count;
        });
        return not_gp_count;
    }

    /**
     * other than Physician & phychiatrist visit count
     * @returns {number}
     */

     get notPhyPsyVisitCount() {
        let not_phy_psy_count = 0;
        this.grades.map(grade => {
            not_phy_psy_count +=grade.not_phy_psy_visit_count;
        });
        return not_phy_psy_count;
    }


    /**
     * Customer count
     * @returns {number}
     */
    get customerCount() {
        let count = 0;
        this.grades.map(grade => {
            count += grade.customer_count;
        });
        return count;
    }

    /**
     * general practitioner customer count
     * @returns {number}
     */

    get gpCustomerCount() {
        let gp_c_count = 0;
        this.grades.map(grade => {
                gp_c_count +=grade.gp_customer_count;
        });
        return gp_c_count;
    }

    /**
     * psychiatrist customer count
     * @returns {number}
     */

    get psyCustomerCount() {
        let psy_c_count = 0;
        this.grades.map(grade => {
                psy_c_count +=grade.psy_customer_count;
        });
        return psy_c_count;
    }

    /**
     * physician customer count
     * @returns {number}
     */

    get phyCustomerCount() {
        let phy_c_count = 0;
        this.grades.map(grade => {
                phy_c_count +=grade.phy_customer_count;
        });
        return phy_c_count;
    }

    /**
     * other than general practitioner customer count
     * @returns {number}
     */

    get notgpCustomerCount() {
        let not_gp_c_count = 0;
        this.grades.map(grade => {
                not_gp_c_count +=grade.not_gp_customer_count;
        });
        return not_gp_c_count;
    }

    /**
     * other than physician and psychiatrist customer count
     * @returns {number}
     */

     get notPhyPsyCustomerCount() {
        let not_phy_psy_c_count = 0;
        this.grades.map(grade => {
            not_phy_psy_c_count +=grade.not_phy_psy_customer_count;
        });
        return not_phy_psy_c_count;
    }

    /**
     * calculate percentage for visit for customer
     * @returns {number}
     */
    get percentageCount() {
        let visitCount = this.visitCount;
        let customerCount = this.customerCount;
        if (customerCount == 0)
            return 0;

        return (visitCount / customerCount) * 100;
    }

    /**
     * calculate percentage for visit for general practitioner
     * @returns {number}
     */
     get gpPercentageCount() {
        let gpVisitCount = this.gpVisitCount;
        let gpCustomerCount = this.gpCustomerCount;
        if (gpCustomerCount == 0)
            return 0;

        return (gpVisitCount / gpCustomerCount) * 100;
    }

    /**
     * calculate percentage for visit for general practitioner
     * @returns {number}
     */
     get phyPercentageCount() {
        let phyVisitCount = this.phyVisitCount;
        let phyCustomerCount = this.phyCustomerCount;
        if (phyCustomerCount == 0)
            return 0;

        return (phyVisitCount / phyCustomerCount) * 100;
    }

    /**
     * calculate percentage for visit for general practitioner
     * @returns {number}
     */
     get psyPercentageCount() {
        let psyVisitCount = this.psyVisitCount;
        let psyCustomerCount = this.psyCustomerCount;
        if (psyCustomerCount == 0)
            return 0;

        return (psyVisitCount / psyCustomerCount) * 100;
    }

    /**
     * calculate percentage for visit for other than physician and psychiatrist
     * @returns {number}
     */
     get notPhyPsyPercentageCount() {
        let notPhyPsyVisitCount = this.notPhyPsyVisitCount;
        let notPhyPsyCustomerCount = this.notPhyPsyCustomerCount;
        if (notPhyPsyCustomerCount == 0)
            return 0;

        return (notPhyPsyVisitCount / notPhyPsyCustomerCount) * 100;
    }

    /**
     * calculate percentage for visit for other than GP
     * @returns {number}
     */
     get notgpPercentageCount() {
        let notgpVisitCount = this.notgpVisitCount;
        let notgpCustomerCount = this.notgpCustomerCount;
        if (notgpCustomerCount == 0)
            return 0;

        return (notgpVisitCount / notgpCustomerCount) * 100;
    }

    /**
     * calculate percentage for visit for customer
     * @returns {number}
     */
    get v2PercentageCount() {
        let customerCount = this.customerCount;
        if (this.v2_count == 0)
            return 0;
        return (this.v2_count / customerCount) * 100
    }

    /**
     * calculate percentage for visit for customer
     * @returns {number}
     */
    get v3PercentageCount() {
        let customerCount = this.customerCount;
        if (this.v3_count == 0)
            return 0;
        return (this.v3_count / customerCount) * 100
    }
}
