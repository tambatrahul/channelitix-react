import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";
import {Message} from "../models/message/message";

@Injectable()
export class MessageService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'messages';

    /**
     * Attendance Service constructor
     *
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
        super(http, _router, _authService);
    }

    /**
     * get all messages for user
     *
     * @returns {Observable<Result>}
     */
    forUser(user_id: number): Observable<Result> {
        // prepare url
        let url = this.getBaseUrl() + '/forUser/' + user_id;

        // make server call
        return this.get(url);
    }

    /**
     * Create Message
     *
     * @param message
     * @returns {Observable<Result>}
     */
    create(message: Message): Observable<Result> {
        return this.post(this.getBaseUrl(), message);
    }

    /**
     * get all unread count messages for user
     *
     * @returns {Observable<Result>}
     */
    unreadCounts(): Observable<Result> {
        // prepare url
        let url = this.getBaseUrl() + '/unread_counts';

        // make server call
        return this.get(url);
    }

    /**
     * read all messages for user
     *
     * @returns {Observable<Result>}
     */
    read(user_id: number): Observable<Result> {
        // prepare url
        let url = this.getBaseUrl() + '/read/' + user_id;

        // make server call
        return this.put(url);
    }

    /**
     * broadcast message
     *
     * @param data
     * @returns {Observable<Result>}
     */
    broadcast(data): Observable<Result> {
        return this.post(this.getBaseUrl() + '/broadcasts/', data);
    }
}
