import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {TerritoryService} from "../../../../../services/territory.service";
import {FormComponent} from "../../../../base/form.component";
import {AuthService} from "../../../../../services/AuthService";
import {BrickService} from "../../../../../services/brick.service";
import {FormBuilder} from "@angular/forms";
declare let jQuery: any;
declare let swal: any;

@Component({
    templateUrl: 'update.component.html',
    styleUrls: ['../index/index.component.less']
})
export class UpdateBrickComponent extends FormComponent {

    private id: number;

    /**
     * Brick relations
     */
    public hq_headquarter_id: number = 0;
    public hq_territory_id: number = 0;
    public name: string;

    /**
     * user form
     *
     * @type {void|FormGroup}
     */
    public form = this._fb.group({
        name: [""],
        hq_headquarter_id: [""],
        hq_territory_id: [""],
        no_of_work_days: [""],
        expected_business: [""],
        distance_from_hq: [""]
    });

    /**
     * Update brick Constructor
     *
     * @param brickService
     * @param _router
     * @param route
     * @param _fb
     * @param _service
     */
    constructor(public brickService: BrickService, public _router: Router, public route: ActivatedRoute, public _fb: FormBuilder,
                public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component
     */
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.loading = true;
            this.brickService.read(this.id).subscribe(response => {
                this.form.patchValue({
                    name: response.brick.name,
                    no_of_work_days: response.brick.no_of_work_days,
                    expected_business: response.brick.expected_business,
                    distance_from_hq: response.brick.distance_from_hq
                });
                this.headquarterChanged(response.brick.hq_territory.hq_headquarter_id);
                this.territoryChanged(response.brick.hq_territory_id);
                this.loading = false;
            }, err => {
                this.loading = false;
            });
        });
    }

    /**
     * update user
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            this.loading = true;
            let data = this.form.value;

            this.brickService.update(data, this.id).subscribe(
                response => {
                    swal({
                        title: "Brick Updated Successfully",
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