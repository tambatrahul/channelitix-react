import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MessageService} from "../../../../services/message.service";
import {AuthService} from "../../../../services/AuthService";
import {User} from "../../../../models/user/user";
import {Message} from "../../../../models/message/message";
import {FormComponent} from "../../../base/form.component";
import {FormBuilder} from "@angular/forms";

declare let jQuery: any;

@Component({
    selector: 'message-create',
    templateUrl: 'create.component.html',
    styleUrls: ['create.component.less']
})
export class MessageCreateComponent extends FormComponent {

    /**
     * User
     */
    private _user: User = new User({});

    /**
     * user to deactivate
     *
     * @type {number}
     */
    @Input()
    set user(user: User) {
        this._user = user;
        this.reset();
    }

    /**
     * tour creation selection
     *
     * @type {EventEmitter}
     */
    @Output()
    messageCreated = new EventEmitter();

    /**
     * message form
     *
     * @type {FormGroup}
     */
    public form = this._fb.group({
        message: ["required"]
    });

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
     * save message
     */
    save() {
        if (this.form.valid) {
            let data = Object.assign({}, this.form.value);

            // set to user
            if (this._user)
                data['to_user_id'] = this._user.id;

            // create message
            this.loading = true;
            this.messageService.create(data).subscribe(
                response => {
                    this.loading = false;
                    this.reset();
                    this.messageCreated.emit();
                },
                err => {
                    this.loading = false;
                    this.errors = err.errors;
                }
            );
        }
    }
}