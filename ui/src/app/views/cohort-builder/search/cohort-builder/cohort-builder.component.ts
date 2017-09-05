import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, Inject } from '@angular/core';
import { SearchGroup, Subject, SearchResult } from '../model';
import { intersection, complement, union } from 'set-manipulator';
import { BroadcastService } from '../service';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: 'cohort-builder.component.html',
  styleUrls: ['cohort-builder.component.css']
})
export class CohortBuilderComponent implements OnInit, OnDestroy {

  /**
   * The search groups that make up the inclusion group.
   */
  public includeGroups: SearchGroup[];

  /**
   * The search groups that make up the exclusion group.
   */
  public excludeGroups: SearchGroup[];

  /**
   * Used to generate total count and charts
   */
  totalSet: Subject[] = [];

  /**
   * Helps resize the include and exclude
   * divs on the fly.
   */
  @ViewChild('includeDiv') includeDiv: any;
  @ViewChild('excludeDiv') excludeDiv: any;

  /**
   * Helps keep a handle on subscriptions
   * so this component can unscribe on destroy.
   */
  private updatedCountSubscription: Subscription;
  private removedSearchResultSubscription: Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private broadcastService: BroadcastService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.includeGroups = [new SearchGroup()];
    this.excludeGroups = [new SearchGroup('Exclude')];

    this.updatedCountSubscription = this.broadcastService.updatedCounts$
      .subscribe(change => {
        this.updateGroupSet(change.searchGroup, change.searchResult);
        this.updateTotalSet();
        this.updateCharts();
      });
    this.removedSearchResultSubscription = this.broadcastService.removedSearchResult$
      .subscribe(change => {
        this.updateGroupSetRemovedSearchResult(change.searchGroup);
        this.updateTotalSet();
        this.updateCharts();
      });
  }

  addSearchGroup() {
    this.includeGroups.push(new SearchGroup());
    this.changeDetectorRef.detectChanges();
    this.includeDiv.scrollTop = this.includeDiv.scrollHeight;
  }

  addExclusionGroup() {
    this.excludeGroups.push(new SearchGroup('Exclude'));
    this.changeDetectorRef.detectChanges();
    this.excludeDiv.scrollTop = this.excludeDiv.scrollHeight;
  }

  removeSearchGroup(searchGroup: SearchGroup) {
    const index: number = this.includeGroups.indexOf(searchGroup);
    if (index !== -1) {
      this.includeGroups.splice(index, 1);
    }
    this.changeDetectorRef.detectChanges();
    this.updateTotalSet();
    this.updateCharts();
  }

  removeExclusionGroup(searchGroup: SearchGroup) {
    const index: number = this.excludeGroups.indexOf(searchGroup);
    if (index !== -1) {
      this.excludeGroups.splice(index, 1);
    }
    this.changeDetectorRef.detectChanges();
    this.updateTotalSet();
    this.updateCharts();
  }

  save(): void {
      this.router.navigate(['../create'], {relativeTo : this.route});
  }

  private updateGroupSet(searchGroup: SearchGroup, searchResult: SearchResult) {
    if (searchGroup.groupSet.length === 0) {
      searchGroup.groupSet = searchResult.resultSet;
    } else {
      searchGroup.groupSet = union(searchGroup.groupSet, searchResult.resultSet, (object: any) => object.val);
    }
  }

  private updateGroupSetRemovedSearchResult(searchGroup: SearchGroup) {
    searchGroup.groupSet = [];
    searchGroup.results.forEach((result, index) => {
      if (index === 0) {
        searchGroup.groupSet = result.resultSet;
      } else if (searchGroup.groupSet.length !== 0) {
        searchGroup.groupSet = union(searchGroup.groupSet, result.resultSet, (object: any) => object.val);
      }
    });
  }

  /* Update any changes to the overall set. */
  private updateTotalSet() {
    const includedSets = this.performIntersection(this.includeGroups);

    const excludedSets = this.performIntersection(this.excludeGroups);

    this.totalSet = includedSets;
    if (excludedSets.length > 0) {
      this.totalSet = complement(includedSets, excludedSets, (object: any) => object.val);
    }
  }

  private performIntersection(groups: SearchGroup[]) {
    let set: any = [];
    groups.forEach((group, index) => {
      if (index === 0) {
        set = group.groupSet;
      } else if (group.groupSet.length !== 0) {
        set = intersection(set, group.groupSet, (object: any) => object.val);
      }
    });
    return set;
  }

  private updateCharts() {

    const counter = function(label: string, index: number, data: any[]) {
      return data
        .map(item => item.val.split(',')[index])
        .map(item => label + (item || 'Unknown'))
        .reduce((counts, item) => ({
          ...counts,
          [item]: (counts[item] || 0) + 1
        }), {});
    };

    const genderCounts = counter('Gender', 0, this.totalSet);
    const raceCounts = counter('Race', 1, this.totalSet);

    const genderData = [
      ['Gender', 'Count', { role: 'style' }],
      ['Female', genderCounts['Gender.F'], 'blue'],
      ['Male', genderCounts['Gender.M'], 'red'],
      ['Unknown', genderCounts['Gender.Unknown'], 'gray']];

    const raceData = [
      ['Race', 'Count Per'],
      ['African American', raceCounts['Race.B']],
      ['Asian/Pacific', raceCounts['Race.A']],
      ['Caucasian', raceCounts['Race.W']],
      ['Native American', raceCounts['Race.I']],
      ['Hispanic', raceCounts['Race.H']],
      ['Other', raceCounts['Race.N']],
      ['Unknown', raceCounts['Race.Unknown']]];

    this.broadcastService.updateCharts(genderData, raceData);
  }

  ngOnDestroy() {
    this.updatedCountSubscription.unsubscribe();
    this.removedSearchResultSubscription.unsubscribe();
  }

}
