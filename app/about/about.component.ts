import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';

import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
    selector: 'app-about',
      moduleId: module.id,
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
  })
  export class AboutComponent extends DrawerPage implements OnInit {

    leaders: Leader[];
    leaderErrMess: string;

    constructor(
        private changeDetectorRef:ChangeDetectorRef,
        private leaderservice: LeaderService,
        @Inject('BaseURL') private BaseURL) {
          super(changeDetectorRef);
        }

    ngOnInit() {
        this.leaderservice.getLeaders()
        .subscribe(leaders => this.leaders = leaders,
          errmess => this.leaderErrMess = <any>errmess);
    
    }
  }