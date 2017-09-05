import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Modifier } from '../model';
import { SearchService, BroadcastService } from '../service';

@Component({
  selector: 'app-wizard-modifiers',
  templateUrl: './wizard-modifiers.component.html',
  styleUrls: ['./wizard-modifiers.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WizardModifiersComponent implements OnInit {

  modifierList: Modifier[] = [];
  ageAtEventSelectList: string[] = [];
  eventDateSelectList: string[] = [];
  hasOccurrencesSelectList: string[] = [];
  visitTypeSelectList: string[] = [];
  daysOrYearsSelectList: string[] = [];
  ageAtEvent: Modifier;
  eventDate: Modifier;
  hasOccurrences: Modifier;
  visitType: Modifier;

  constructor(private searchService: SearchService,
              private broadcastService: BroadcastService) { }

  ngOnInit() {
    this.ageAtEventSelectList = this.searchService.getAgeAtEventSelectList();
    this.eventDateSelectList = this.searchService.getEventDateSelectList();
    this.hasOccurrencesSelectList = this.searchService.getHasOccurrencesSelectList();
    this.daysOrYearsSelectList = this.searchService.getDaysOrYearsSelectList();
    this.visitTypeSelectList = this.searchService.getVisitTypeSelectList();

    if (this.modifierList.length === 0) {
      this.ageAtEvent = new Modifier();
      this.ageAtEvent.operator = this.ageAtEventSelectList[0];
      this.ageAtEvent.name = 'ageAtEvent';
      this.modifierList.push(this.ageAtEvent);

      this.eventDate = new Modifier();
      this.eventDate.operator = this.eventDateSelectList[0];
      this.eventDate.name = 'eventDate';
      this.modifierList.push(this.eventDate);

      this.hasOccurrences = new Modifier();
      this.hasOccurrences.operator = this.hasOccurrencesSelectList[0];
      this.hasOccurrences.name = 'hasOccurrences';
      this.hasOccurrences.value3 = this.daysOrYearsSelectList[0];
      this.modifierList.push(this.hasOccurrences);

      this.visitType = new Modifier();
      this.visitType.name = 'visitType';
      this.visitType.value1 = this.visitTypeSelectList[0];
      this.modifierList.push(this.visitType);
    } else {
      this.ageAtEvent = this.modifierList[0];
      this.eventDate = this.modifierList[1];
      this.hasOccurrences = this.modifierList[2];
    }
  }

  onChange(newValue) {
    this.broadcastService.setSummaryModifierList(this.modifierList);
  }

}
