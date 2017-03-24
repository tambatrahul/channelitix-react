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
    user: User = new User({});

    /**
     * users
     *
     * @type {{}}
     */
    public users: User[] = [];

    /**
     * Message List Component Constructor
     */
    constructor(private messageService: MessageService, public _service: AuthService, public userService: UserService) {
        super(_service);
    }

    /**
     * on start of app set this details
     */
    ngOnInit() {
        super.ngOnInit();
        this.fetch();
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.loading = true;
        this.userService.all().subscribe(
            response => {
                this.users = response.users;
                this.user = this.users[0];
                this.loading = false;
            },
            err => {
                this.loading = false;
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