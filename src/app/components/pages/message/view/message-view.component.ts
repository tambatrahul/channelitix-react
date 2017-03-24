import {Component, Input} from "@angular/core";
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

    /**
     * messages
     *
     * @type {Array}
     */
    messages: Message[] = [];

    /**
     * message form
     *
     * @type {FormGroup}
     */
    public form = this._fb.group({
        message: ["required"]
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

    /**
     * get user
     *
     * @returns {User}
     */
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

    /**
     * reset form
     */
    reset() {
        this.form.patchValue({
            message: ''
        });
        this.errors = "";
    }

    /**
     * Fetch Messages from server
     */
    fetch() {
        if (this._user.id) {
            this.messageService.forUser(this._user.id).subscribe(
                response => {
                    this.messages = response.messages.map(function (message) {
                        return new Message(message);
                    });
                },
                err => {
                }
            );
        }
    }

    /**
     * save message
     */
    save() {
        if (this.form.valid) {
            let data = Object.assign({}, this.form.value);

            // set to user
            if (this._user)
                data['to_user_id'] = this._user.id;

            // create message
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