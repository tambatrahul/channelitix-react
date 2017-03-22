import {Component, Input, EventEmitter, Output} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base.component";
import {MessageService} from "../../../../services/message.service";
import {AuthService} from "../../../../services/AuthService";
import {User} from "../../../../models/user/user";
import {Message} from "../../../../models/message/message";
import {FormComponent} from "../../../base/form.component";
import {FormBuilder} from "@angular/forms";

declare let jQuery: any;

@Component({
    selector: 'message-view',
    templateUrl: 'message-view.component.html',
    styleUrls: ['message-view.component.less']
})
export class MessageViewComponent extends FormComponent {

    /**
     * User
     */
    private _user: User;
    messages: Message[] = [];

    public form = this._fb.group({
        message: [""]
    });

    /**
     * user to deactivate
     *
     * @type {number}
     */
    @Input()
    set user(user: User) {
        this._user = user;
        this.fetch();
        this.reset();
    }

    get user() {
        return this._user;
    }

    /**
     * Message List Component Constructor
     *
     */
    constructor(private messageService: MessageService, public _service: AuthService, public _fb: FormBuilder) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * reset form
     */
    reset() {
        this.form.patchValue({
            message: ""
        });
        this.errors = "";
    }

    /**
     * Fetch Messages from server
     */
    fetch() {
        this.messageService.forUser(this._user.id).subscribe(
            response => {
                this.messages = response.messages;
            },
            err => {
            }
        );
    }

    /**
     * save message
     */
    save() {
        if (this.form.valid) {
            let data = Object.assign({}, this.form.value);

            if (this._user)
                data['to_user_id'] = this._user.id;

            this.messageService.create(data).subscribe(
                response => {
                    this.reset();
                    this.fetch();
                },
                err => {
                    this.errors = err.errors;
                }
            );
        }
    }
}