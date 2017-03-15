import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {BrickService} from "../../../../../services/brick.service";
import {FormComponent} from "../../../../base/form.component";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../../../../services/AuthService";
declare let jQuery: any;
declare let swal: any;

@Component({
    templateUrl: 'create.component.html',
    styleUrls: ['../index/index.component.less']
})
export class CreateBrickComponent extends FormComponent {

    /**
     * Brick relations
     */
    public hq_headquarter_id: number = 0;
    public hq_territory_id: number = 0;
    public name: string;

    /**
     * bricks form
     *
     * @type {void|FormGroup}
     */
    public form = this._fb.group({
        name: [""],
        hq_headquarter_id: [""],
        hq_territory_id: [""]
    });

    /**
     * Create brick Constructor
     *
     * @param brickService
     * @param _router
     * @param _fb
     * @param _service
     */
    constructor(public brickService: BrickService, public _router: Router, public _fb: FormBuilder,
                public _service: AuthService) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * create brick
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            this.loading = true;
            let data = Object.assign({}, this.form.value);

            this.brickService.create(data).subscribe(
                response => {
                    swal({
                        title: "Brick Created Successfully",
                        text: "I will close in 2 sec.",
                        type: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    this._router.navigate(['/bricks']);
                    this.loading = false;
                },
                err => {
                    this.loading = false;
                    this.errors = err.errors;
                }
            );
        }
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
}
