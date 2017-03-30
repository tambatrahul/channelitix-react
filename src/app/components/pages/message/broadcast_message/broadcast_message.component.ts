import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../../../services/user.service";
import {AuthService} from "../../../../services/AuthService";
import {FormComponent} from "../../../base/form.component";
import {User} from "../../../../models/user/user";
import {MessageService} from "../../../../services/message.service";
declare let jQuery: any;
declare let swal: any;

@Component({
    selector: 'broadcast-message',
    templateUrl: 'broadcast_message.component.html'
})
export class BroadcastMessageComponent extends FormComponent {

    /**
     * list of users
     */
    private _users: User;

    /**
     * loading identifier
     */
    @ViewChild('broadcast_message_model')
    broadcast_message_model: ElementRef;

    /**
     * user to deactivate
     *
     * @type {number}
     */
    @Input()
    set users(users: User) {
        this._users = users;
        if (users) {
            jQuery(this.broadcast_message_model.nativeElement).modal();
        }
    }

    get users() {
        return this._users;
    }

    /**
     * event on broadcast message
     *
     * @type {EventEmitter}
     */
    @Output()
    broadcastMessage = new EventEmitter();

    /**
     * user form
     *
     * @type {void|FormGroup}
     */
    public form = this._fb.group({
        user_ids: [""],
        message: [""],
    });

    /**
     * broadcast message constructor
     *
     * @param userService
     * @param messageService
     * @param _router
     * @param _fb
     * @param _service
     */
    constructor(public userService: UserService, public messageService: MessageService,
                public _router: Router, public _fb: FormBuilder,
                public _service: AuthService) {
        super(_service);
    }

    reset() {
        this.form.patchValue({
            message: [""],
            user_ids: [""]
        });
    }

    /**
     * broadcast message
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            let data = this.form.value;

            // make server call
            this.messageService.broadcast(data).subscribe(
                response => {
                    this.reset();
                },
                err => {
                    this.errors = err.errors;
                }
            );
        }
    }
}
