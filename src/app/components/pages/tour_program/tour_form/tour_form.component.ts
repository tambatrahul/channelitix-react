import {Component, Output, EventEmitter, Input} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import {FormComponent} from "../../../base/form.component";
import {FormBuilder} from "@angular/forms";
import * as moment from "moment";
import {TourService} from "../../../../services/tour.service";
import {TerritoryService} from "../../../../services/territory.service";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
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
    _user: User;
    _manager_id: number;
    showTerritory: boolean = false;

    @Input()
    set user(user: User) {
        // set user
        this._user = user;
        this.showTerritory = false;
        this.headquarter_id = 0;
        this.territoryChanged(0);
        this.brickChanged(0);

        // check if territory to show or not
        if (user.role_id == 3) {
            this.showTerritory = true;
            this.headquarter_id = user.hq_headquarter_id;
        } else {
            if (user.role_id != 5)
                this._manager_id = user.id;
            else
                this._manager_id = 0;
        }

        // set to form
        this.form.patchValue({user_id: user.id});
    }

    get() {
        return this._user;
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
    public headquarter_id: number = 0;
    public territory_id: number = 0;
    public brick_id: number = 0;
    public working_with_id: number = 0;
    public form = this._fb.group({
        hq_territory_id: [""],
        hq_brick_id: [""],
        working_with_id: [""],
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

        if (!this._user) {
            this.user = this._service.user;
        }
    }

    /**
     * reset form
     */
    reset() {
        this.territoryChanged(0);
        this.brickChanged(0);
        this.tourTypeChanged("");
        this.form.patchValue({
            hq_territory_id: 0,
            hq_brick_id: 0
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
            data.hq_brick_id = String(data.hq_brick_id > 0 ? data.hq_brick_id : '');
            data.hq_territory_id = String(data.hq_territory_id > 0 ? data.hq_territory_id : '');

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
     * manager is changed
     *
     * @param working_with_id
     */
    userChanged(working_with_id) {
        this.working_with_id = working_with_id;
        this.form.patchValue({working_with_id: working_with_id});
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
