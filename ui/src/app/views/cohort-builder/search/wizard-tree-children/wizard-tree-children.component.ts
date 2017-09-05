import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SearchService, BroadcastService } from '../service';
import { Criteria, SearchParameter } from '../model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-wizard-tree-children',
  templateUrl: 'wizard-tree-children.component.html',
  styleUrls: ['wizard-tree-children.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WizardTreeChildrenComponent implements OnInit, OnDestroy {

  @Input() node: Criteria;
  loading: boolean;
  nodes: Criteria[] = [];
  subscription: Subscription;

  constructor(private searchService: SearchService,
              private broadcastService: BroadcastService) { }

  ngOnInit() {
    this.loading = true;
    this.subscription = this.searchService.getChildNodes(this.node)
      .subscribe(nodes => {
        this.nodes = nodes;
        this.loading = false;
      });
  }

  public selectCriteria(node): void {
    node.values.push(new SearchParameter(node.code, node.domainId));
    this.broadcastService.selectCriteria(node);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
