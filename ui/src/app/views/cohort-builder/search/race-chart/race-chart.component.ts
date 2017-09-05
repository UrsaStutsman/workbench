import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GoogleChartDirective } from '../google-chart/google-chart.directive';
import { BroadcastService } from '../service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-race-chart',
  templateUrl: 'race-chart.component.html',
  styleUrls: ['race-chart.component.css']
})
export class RaceChartComponent implements OnInit, OnDestroy {

  @ViewChild(GoogleChartDirective) raceChartDirective: GoogleChartDirective;
  public type = 'PieChart';
  private subscription: Subscription;

  public data = [
    ['Race', 'Count Per'],
    ['Unknown', 0]];

  public options  = {
    title: 'Results By Race',
    chartArea: {width: '80%'},
    width: '100%',
    height: '300'
  };

  constructor(private broadcastService: BroadcastService) { }

  ngOnInit() {
    this.subscription = this.broadcastService.updatedCharts$
      .subscribe(change => {
        this.redraw(change.race);
      });
  }

  redraw(data: any) {
    this.raceChartDirective.drawGraph(this.options, this.type, data, this.raceChartDirective._element);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
