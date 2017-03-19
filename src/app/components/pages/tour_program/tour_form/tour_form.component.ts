import {Component, Output, EventEmitter, Input} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import {FormComponent} from "../../../base/form.component";
import {FormBuilder} from "@angular/forms";
import * as moment from "moment";
import {TourService} from "../../../../services/tour.service";
import {TerritoryService} from "../../../../services/territory.service";
declare let jQuery: any;
declare let swal: any;

@Component({
    selector: 'add-tour',
    templateUrl: 'tour_form.component.html',
    styleUrls: ['tour_form.component.less']
})
export class TourFormComponent extends FormComponent {

    /**
     * tour creation selection
     *
     * @type {EventEmitter}
     */
    @Output()
    tourCreated = new EventEmitter();

    /**
     * isSunday boolean
     *
     * @type {boolean}
     */
    public isSunday: boolean = false;

    /**
     * user details
     */
    _user_id: number;
    @Input()
    set user_id(user_id: number) {
        this._user_id = user_id;
        this.form.patchValue({user_id: user_id});
    }

    get() {
        return this._user_id;
    }

    /**
     * tour deleted selection
     *
     * @type {EventEmitter}
     */
    @Output()
    tourDeleted = new EventEmitter();

    /**
     * Date of tour
     */
    _date: string;
    type: string;

    @Input()
    set date(date: string) {
        this.form.patchValue({date: date});
        let new_date = moment(date, "YYYY-MM-DD");
        this._date = new_date.format("DD MMMM YYYY");
        this.isSunday = new_date.day() == 0;
    };

    /**
     * form fields
     */
    public territory_id: number = 0;
    public brick_id: number = 0;
    public form = this._fb.group({
        hq_territory_id: [""],
        hq_brick_id: [""],
        user_id: [""],
        date: [""],
        type: [""]
    });

    /**
     * User Component Constructor
     *
     * @param tourService
     * @param t_service
     * @param _router
     * @param _fb
     * @param _service
     */
    constructor(private tourService: TourService, private t_service: TerritoryService,
                public _router: Router, public _fb: FormBuilder, public _service: AuthService) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
        if (!this._user_id)
            this.form.patchValue({user_id: this._service.user.id});
    }

    /**
     * reset form
     */
    reset() {
        this.territory_id = 0;
        this.brick_id = 0;
        this.form.patchValue({
            territory_id: 0,
            brick_id: 0
        });
        this.errors = {};
    }

    /**
     * Fetch all details
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            this.loading = true;
            let data = Object.assign({}, this.form.value);

            this.tourService.create(data).subscribe(
                response => {
                    this.loading = false;
                    swal({
                        title: "Tour Added Successfully",
                        text: "I will close in 2 sec.",
                        type: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    this.reset();
                    this.tourCreated.emit();
                },
                err => {
                    this.loading = false;
                    this.errors = err.errors;
                }
            );
        }
    }

    /**
     * when territory id is changed
     *
     * @param territory_id
     */
    territoryChanged(territory_id) {
        this.territory_id = territory_id;
        this.form.patchValue({hq_territory_id: territory_id});
    }

    /**
     * brick is changed
     *
     * @param brick_id
     */
    brickChanged(brick_id) {
        this.brick_id = brick_id;
        this.form.patchValue({hq_brick_id: brick_id});
    }

    /**
     * tour type is changed
     *
     * @param type
     */
    tourTypeChanged(type) {
        this.type = type;
        this.form.patchValue({type: type});
    }

    /**
     * toggle sunday
     */
    toggleSunday() {
        this.isSunday = !this.isSunday;
    }
}
