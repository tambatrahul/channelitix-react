import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MessageService} from "../../../../services/message.service";
import {AuthService} from "../../../../services/AuthService";
import {User} from "../../../../models/user/user";
import {Message} from "../../../../models/message/message";
import {FormBuilder} from "@angular/forms";
import {BaseAuthComponent} from "../../../base/base_auth.component";

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
     * tour creation selection
     *
     * @type {EventEmitter}
     */
    @Output()
    messageLoaded = new EventEmitter();
    @Output()
    messageRead = new EventEmitter();

    /**
     * refresh message list
     * @param refresh
     */
    @Input()
    set refresh(refresh) {
        this.fetch();
    }

    /**
     * user to deactivate
     *
     * @type {number}
     */
    @Input()
    set user(user: User) {
        this._user = user;
        this.fetch();
        this.read();
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
        if (this._user && this._user.id) {
            this.loading = true;
            this.messageService.forUser(this._user.id).subscribe(
                response => {
                    this.loading = false;
                    this.messages = response.messages.map(function (message) {
                        return new Message(message);
                    });

                    this.messageLoaded.emit();
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * Read Messages from server
     */
    read() {
        if (this._user && this._user.id) {
            this.loading = true;
            this.messageService.read(this._user.id).subscribe(
                response => {
                    this.loading = false;
                    this.messages = response.messages.map(function (message) {
                        return new Message(message);
                    });

                    this.messageRead.emit(this._user.id);
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }
}