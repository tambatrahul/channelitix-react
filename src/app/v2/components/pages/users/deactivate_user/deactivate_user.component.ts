import * as moment from "moment";
import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {FormComponent} from "../../../../../components/base/form.component";
import {User} from "../../../../../models/user/user";
import {AuthService} from "../../../../../services/AuthService";
import {V2UserService} from "../../../../../services/v2/user.service";
declare let jQuery: any;
declare let swal: any;

@Component({
    selector: 'deactivate-user-v2',
    templateUrl: 'deactivate_user.component.html'
})
export class V2DeactivateUserComponent extends FormComponent {

    private _user: User;
    public leaving_date: string;

    /**
     * loading identifier
     */
    @ViewChild('deactivating_modal')
    deactivating_modal: ElementRef;

    /**
     * user to deactivate
     *
     * @type {number}
     */
    @Input()
    set user(user: User) {
        this._user = user;
        if (user.id) {
            jQuery(this.deactivating_modal.nativeElement).modal();
        }
    }

    get user() {
        return this._user;
    }

    /**
     * event on user deactivating
     *
     * @type {EventEmitter}
     */
    @Output()
    userDeactivated = new EventEmitter();

    /**
     * user form
     *
     * @type {void|FormGroup}
     */
    public form = this._fb.group({
        leaving_date: [""]
    });

    /**
     * Deactivate user Constructor
     *
     * @param userService
     * @param _router
     * @param _fb
     * @param _service
     */
    constructor(public userService: V2UserService, public _router: Router, public _fb: FormBuilder,
                public _service: AuthService) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
        this.dateChanged(moment().format('DD MMMM YYYY'));
    }

    /**
     * Deactivate user
     */
    save() {
        let self = this;
        this.submitted = true;
        if (this.form.valid) {
            let data = this.form.value;

            // format Deactivate date
            if (data.leaving_date)
                data.leaving_date = moment(data.leaving_date, "DD MMMM YYYY").format('YYYY-MM-DD');

            // make server call
            this.userService.deactivate(data, this._user.id).subscribe(
                response => {
                    swal({
                        title: "User Deactivated Successfully",
                        text: "I will close in 2 sec.",
                        type: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    jQuery(self.deactivating_modal.nativeElement).modal('hide');
                    self.userDeactivated.emit(this._user);
                },
                err => {
                    this.errors = err.errors;
                }
            );
        }
    }

    /**
     * on leaving date changed
     */
    dateChanged(date) {
        this.leaving_date = date;
        this.form.patchValue({leaving_date: date});
    }
}
