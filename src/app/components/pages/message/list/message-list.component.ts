import {Component} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base.component";
import {MessageService} from "../../../../services/message.service";
import {AuthService} from "../../../../services/AuthService";
import {UserService} from "../../../../services/user.service";
import {User} from "../../../../models/user/user";
declare let jQuery: any;

@Component({
    templateUrl: 'message-list.component.html',
    styleUrls: ['message-list.component.less']
})
export class MessageListComponent extends BaseAuthComponent {


    /**
     * Resetting User Password
     */
     user: User;

    /**
     * users
     *
     * @type {{}}
     */
    public users: User[] = [];

    /**
     * Message List Component Constructor
     *
     */
    constructor(private messageService: MessageService, public _service: AuthService, public userService: UserService) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
        this.fetch();
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.userService.all().subscribe(
            response => {
                this.users = response.users;
            },
            err => {
            }
        );
    }

    /**
     * On User Selected
     *
     * @param user
     */
    onUserSelected(user: User) {
        this.user = user;
    }
}