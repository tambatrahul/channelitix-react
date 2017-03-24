import {Component, Input} from "@angular/core";
import {MessageService} from "../../../../services/message.service";
import {AuthService} from "../../../../services/AuthService";
import {User} from "../../../../models/user/user";
import {Message} from "../../../../models/message/message";
import {FormBuilder} from "@angular/forms";
import {BaseAuthComponent} from "../../../base/base.component";

declare let jQuery: any;

@Component({
    selector: 'message-view',
    templateUrl: 'message-view.component.html',
    styleUrls: ['message-view.component.less']
})
export class MessageViewComponent extends BaseAuthComponent {

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
     * user to deactivate
     *
     * @type {number}
     */
    @Input()
    set user(user: User) {
        this._user = user;
        this.fetch();
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
     * message created refresh message list
     */
    messageCreated() {
        this.fetch();
    }
}