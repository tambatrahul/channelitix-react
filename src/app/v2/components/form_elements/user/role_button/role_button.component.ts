import {Component, Input, Output, EventEmitter} from "@angular/core";
import {BaseSelectComponent} from "../../../../../components/form_elements/base-select.component";
import {V2UserService} from "../../../../../services/v2/user.service";

@Component({
    selector: 'role_button',
    templateUrl: 'role_button.component.html',
    inputs: ['refresh']
})

export class RoleButtonComponent extends BaseSelectComponent {

    /**
     *  role id
     */
    private _role_id: number = 0;

    /**
     *  status
     */
    private _status: string;

    /**
     *  region_id
     */
    private _region_id: number;

    /**
     *  area_id
     */
    private _area_id: number;

    @Output()
    onRoleChanged = new EventEmitter();

    constructor(private userService: V2UserService) {
        super();
    }

    /**
     * role_id getter and setters
     *
     * @param role_id
     */
    @Input()
    set role_id(role_id: number) {
        this._role_id = role_id;
        this.fetch();
    }

    get role_id(): number {
        return this._role_id;
    }

    /**
     * status getter and setters
     *
     * @param status
     */
    @Input()
    set status(status: string) {
        this._status = status;
        this.fetch();
    }

    get status(): string {
        return this._status;
    }

    /**
     * region_id getter and setters
     *
     * @param role_id
     */
    @Input()
    set region_id(region_id: number) {
        this._region_id = region_id;
        this.fetch();
    }

    get region_id(): number {
        return this._region_id;
    }

    /**
     * area_id getter and setters
     *
     * @param area_id
     */
    @Input()
    set area_id(area_id: number) {
        this._area_id = area_id;
        this.fetch();
    }

    get area_id(): number {
        return this._area_id;
    }

    /**
     * fetch customer types from constants
     */
    fetch() {
        this.userService.all(this.role_id, this.status, this.region_id, this.area_id).subscribe(
            response => {
                this.models = response.users;

                this.onRoleChanged.emit({
                    'users': this.models
                });
            },
            err => {
            }
        );
    }

    roleUser(id) {
        this.role_id = id;
    }
}
