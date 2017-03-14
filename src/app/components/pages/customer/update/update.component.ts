import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import {CustomerService} from "../../../../services/customer.service";
import {FormBuilder} from "@angular/forms";
import {FormComponent} from "../../../base/form.component";
declare let jQuery: any;
declare let swal: any;

@Component({
    selector: 'update-customer',
    templateUrl: 'update.component.html',
    styleUrls: ['update.component.less']
})
export class UpdateCustomerComponent extends FormComponent {

    customer_types: Array<Object> = [];
    customer_grades: Array<Object> = [];
    private id: number;

    /**
     * Customer type and grade
     */
    public customer_type_id: number = 0;
    public grade_id: number = 0;
    public hq_headquarter_id: number = 0;
    public hq_territory_id: number = 0;
    public hq_area_id: number = 0;
    public hq_region_id: number = 0;
    public hq_brick_id: number = 0;

    /**
     * customer form
     *
     * @type {void|FormGroup}
     */
    public form = this._fb.group({
        firm_name: [""],
        email: [""],
        mobile: [""],
        customer_type_id: [""],
        grade_id: [""],
        hq_region_id: [""],
        hq_area_id: [""],
        hq_headquarter_id: [""],
        hq_territory_id: [""],
        hq_brick_id: [""],
        address: this._fb.group({
            line: [""],
            landmark: [""],
            area_str: [""],
            pincode: [""],
            taluka_str: [""],
            district_str: [""],
            state_str: [""],
            country_str: [""],
        }),
    });

    /**
     * Update customer Constructor
     *
     * @param customerService
     * @param _router
     * @param _fb
     * @param _service
     */
    constructor(public customerService: CustomerService, public _router: Router, public route: ActivatedRoute,
                public _fb: FormBuilder, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component
     */
    ngOnInit() {
        super.ngOnInit();
        this.regionChanged(this._service.user.hq_region_id);
        this.areaChanged(this._service.user.hq_area_id);
        this.headquarterChanged(this._service.user.hq_headquarter_id);
        this.territoryChanged(this._service.user.hq_territory_id);
        this.brickChanged(this._service.user.hq_brick_id);
        this.customerGrade();

        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.loading = true;
            this.customerService.read(this.id).subscribe(response => {
                this.loading = false;
            }, err => {
                this.loading = false;
            });
        });
    }

    /**
     * Customer Grade
     */
    customerGrade() {
        if(this.customer_type_id > 0) {
            this.customerService.masters().subscribe(
                response => {
                    this.customer_grades = response.customer_types;
                },
                err => {
                }
            );
        }
    }

    /**
     * update customer
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            this.loading = true;
            let data = this.form.value;

            this.customerService.update(data, this.id).subscribe(
                response => {
                    this.loading = false;
                    swal({
                        title: "Customer Created Successfully",
                        text: "I will close in 2 sec.",
                        type: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    this._router.navigate(['/customers']);
                },
                err => {
                    this.loading = false;
                    console.log(err);
                    this.errors = err.errors;
                }
            );
        }
    }

    /**
     * Type changed
     */
    typeChanged(customer_type_id) {
        this.customer_type_id = customer_type_id;
        this.form.patchValue({customer_type_id: customer_type_id});
    }

    /**
     * Grade changed
     */
    gradeChanged(grade_id) {
        this.grade_id = grade_id;
        this.form.patchValue({grade_id: grade_id});

    }

    /**
     * when region is changed filter list of customer
     * @param region_id
     */
    regionChanged(region_id) {
        this.hq_region_id = region_id;
        this.form.patchValue({hq_region_id: region_id});
    }

    /**
     * when area is changed filter list of customer
     * @param area_id
     */
    areaChanged(area_id) {
        this.hq_area_id = area_id;
        this.form.patchValue({hq_area_id: area_id});
    }

    /**
     * when territory is changed filter list of customer
     * @param territory_id
     */
    territoryChanged(territory_id) {
        this.hq_territory_id = territory_id;
        this.form.patchValue({hq_territory_id: territory_id});
    }

    /**
     * when headquarter is changed filter list of customer
     * @param headquarter_id
     */
    headquarterChanged(headquarter_id) {
        this.hq_headquarter_id = headquarter_id;
        this.form.patchValue({hq_headquarter_id: headquarter_id});
    }

    /**
     * when brick is changed filter list of customer
     * @param hq_brick_id
     */
    brickChanged(hq_brick_id) {
        this.hq_brick_id = hq_brick_id;
        this.form.patchValue({hq_brick_id: hq_brick_id});
    }

}
