import {Component, ViewChild, ElementRef} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {MessageService} from "../../../../services/message.service";
import {AuthService} from "../../../../services/AuthService";
import {UserService} from "../../../../services/user.service";
import {User} from "../../../../models/user/user";
import {Message} from "../../../../models/message/message";
declare let jQuery: any;

@Component({
    templateUrl: 'message-list.component.html',
    styleUrls: ['message-list.component.less']
})
export class MessageListComponent extends BaseAuthComponent {

    /**
     * loading identifier
     */
    @ViewChild('task_info')
    task_info: ElementRef;

    /**
     * refresh message list
     */
    refresh: boolean = false;

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
     * messages
     *
     * @type {{}}
     */
    public messages: Message[] = [];

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
     * after the view is checked
     */
    ngAfterViewChecked() {
        // get window hight
        let wh = jQuery(window).height();

        // get container
        let AppsContainer = jQuery('.apps-container');

        // get offset to be reduced
        let AppsTopOffset = 0;
        if (AppsContainer.length) {
            AppsTopOffset = AppsContainer.offset().top + 60;
        }

        // get actual height
        let AppsCalH = wh - AppsTopOffset;

        // set height
        jQuery('.apps-panel-scroll').css({
            'height': AppsCalH + 'px'
        });
        jQuery('.task-info').css({
            'height': AppsCalH - 130 + 'px'
        });

        // set width of task body
        let NoteSideW = jQuery('.task-sidebar').width();
        let NoteListW = jQuery('.task-list').width();
        let NoteBodyCal = jQuery(window).width() - (NoteSideW + NoteListW);
        jQuery('.task-body').css({
            'width': (NoteBodyCal - jQuery('.left-aside').width()) + 'px'
        });
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.loading = true;
        this.userService.all().subscribe(
            response => {
                this.users = response.users.map(function(user) {
                    return new User(user);
                });
                this.fetchUnreadCount();
                this.user = this.users[0];
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * Fetch Unread Count for User
     */
    fetchUnreadCount() {
        this.loading = true;
        this.messageService.unreadCounts().subscribe(
            response => {
                this.messages = response.messages;
                this.prepareUser();
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * Prepare User Skelton
     */
    prepareUser() {
        let self = this;
        this.users.map(function (user) {
            self.messages.map(function (message) {
                if (user.id == message.created_by)
                    user.unread_count = message.unread_count;
            });
        });

        this.users.sort(function (u2, u1) {
            return u1.unread_count - u2.unread_count;
        });
    }

    /**
     * On User Selected
     *
     * @param user
     */
    onUserSelected(user: User) {
        this.user = user;
    }

    /**
     * message sent to user
     */
    messageCreated() {
        this.refresh = !this.refresh;
    }

    /**
     * message loaded
     */
    messagesLoaded() {
        let self = this;
        setTimeout(function () {
            jQuery(self.task_info.nativeElement).scrollTop(self.task_info.nativeElement.scrollHeight);
        }, 10);

    }

    /**
     * Message Read
     */
    messagesRead(user_id) {
        this.users.map(function (user) {
            if (user.id == user_id)
                user.unread_count = null;
        })
    }
}