import {Component} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base.component";
import {MessageService} from "../../../../services/message.service";
import {AuthService} from "../../../../services/AuthService";
declare let jQuery: any;

@Component({
    templateUrl: 'message-list.component.html',
    styleUrls: ['message-list.component.less']
})
export class MessageListComponent extends BaseAuthComponent {

    /**
     * Message List Component Constructor
     *
     */
    constructor(private messageService: MessageService, public _service: AuthService) {
        super(_service);
    }

}