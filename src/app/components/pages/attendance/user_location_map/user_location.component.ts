import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import {UserService} from "../../../../services/user.service";
import {FormBuilder} from "@angular/forms";
import {FormComponent} from "../../../base/form.component";
import { GoogleChartComponent } from "app/components/base/google_chart.component";
import { AppConstants } from "app/app.constants";
import { UserLocationService } from "app/services/user_location.service";
import { UserLocation } from "app/models/user/user_location";
declare let jQuery: any;
declare let swal: any;

@Component({
    templateUrl: 'user_location.component.html',

})
export class UserLocationComponent extends GoogleChartComponent {

    /**
     * chart and data
     */
    private chart;
    public chart_data;
    private month_year;
    private user_id;

    /**
     * Create user Constructor
     *
     * @param userLocationService
     * @param userService
     * @param _router
     * @param route
     * @param _service
     */
    constructor(public userLocationService: UserLocationService,
                public _router: Router, public route: ActivatedRoute,
                public userService: UserService, public _service: AuthService) {
        super(_service);
      console.log("hi");
    }

    /**
     * initialize details
     */
    ngOnInit() {
        super.ngOnInit();
        this.route.params.subscribe(params => {
            this.month_year = params['month_year'];
            this.user_id = params['id'];
            this.fetchPerformance();
        });
    }

    protected fetch() {

    }

    /**
    * draw graph
    */
    drawGraph() {
        let options = {
            chartArea: {left: 60, top: 40, bottom: 40, right: 40, width: "100%", height: "100%"},
            legend: {position: 'top', alignment: 'start'},
            hAxis: {
                title: 'Month'
            },
            vAxis: {
                title: 'Sales'
            },
            colors: ['#097138', '#e67e22', '#3366cc']
        };

        this.chart = this.createLineChart(document.getElementById('p_s_t_sales'));
        this.chart.draw(this.chart_data, options);
    }

    /**
    * Chart data
    */
    fetchPerformance = AppConstants.debounce(function () {
        const self = this;
        self.loading = true;
        self.userLocationService.all(this.user_id, this.month_year).subscribe(
            response => {
                self.loading = false;
                let user_locations = response.user_locations.map(ul => new UserLocation(ul));
                self.prepareData(user_locations);
            },
            err => {
                self.loading = false;
            }
        );
    }.bind(this), 1000, false);

    /**
    * prepare data for graph
    */
    prepareData(user_locations: UserLocation[]) {
        this.getGoogle().charts.setOnLoadCallback(() => {
            let google = this.getGoogle();
            let data = new google.visualization.DataTable();
            data.addColumn('number', 'Lat');
            data.addColumn('number', 'Long');
            data.addColumn('string', 'Date');

            let locations = [];
            locations = user_locations.map(l => [l.latitude, l.longitude, l.date]);

            data.addRows(locations);
            this.chart_data = data;

            this.drawGraph();
        });
    }
}
