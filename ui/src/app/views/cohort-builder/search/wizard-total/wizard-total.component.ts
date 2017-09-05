import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BroadcastService, SearchService } from '../service';
import { Criteria, Modifier } from '../model';

@Component({
  selector: 'app-wizard-total',
  templateUrl: './wizard-total.component.html',
  styleUrls: ['./wizard-total.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WizardTotalComponent implements OnInit, OnDestroy {

  private criteriaGroupSubscription: Subscription;
  private modifierListSubscription: Subscription;
  private criteriaTypeSubscripiton: Subscription;
  criteriaType: string;
  private criteriaList: Criteria[] = [];
  private modifierList: Modifier[] = [];
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
      this.hasOccurrences.value3 = this.daysOrYearsSelectList[0];
      this.hasOccurrences.name = 'hasOccurrences';
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

    this.criteriaGroupSubscription = this.broadcastService.summaryCriteriaGroup$
      .subscribe(criteriaList =>
        this.criteriaList = criteriaList);
    this.modifierListSubscription = this.broadcastService.summaryModifierList$
      .subscribe(modifierList => {
        this.modifierList = modifierList;
        this.ageAtEvent = this.modifierList[0];
        this.eventDate = this.modifierList[1];
        this.hasOccurrences = this.modifierList[2];
        this.visitType = this.modifierList[3];
      });
    this.criteriaTypeSubscripiton = this.broadcastService.selectedCriteriaType$
      .subscribe(criteriaType =>
        this.criteriaType = criteriaType);
  }

  public getTypeDescription(): string {
    if (this.criteriaType === 'icd9'
      || this.criteriaType === 'icd10'
      || this.criteriaType === 'cpt') {
      return this.criteriaType.toUpperCase() + ' Codes';
    }
    return this.criteriaType;
  }

  public getTotal(): number {
    let totalCount = 0;
    this.criteriaList.map(criteria => totalCount = totalCount + criteria.count);
    return totalCount;
  }

  ngOnDestroy() {
    this.criteriaGroupSubscription.unsubscribe();
    this.modifierListSubscription.unsubscribe();
    this.criteriaTypeSubscripiton.unsubscribe();
  }

}
