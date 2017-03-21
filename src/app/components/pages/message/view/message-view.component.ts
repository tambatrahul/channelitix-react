import {Component, Input, EventEmitter, Output} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base.component";
import {MessageService} from "../../../../services/message.service";
import {AuthService} from "../../../../services/AuthService";
import {User} from "../../../../models/user/user";
import {Message} from "../../../../models/message/message";
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

    get user() {
        return this._user;
    }

    /**
     * Message List Component Constructor
     *
     */
    constructor(private messageService: MessageService, public _service: AuthService) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
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
}