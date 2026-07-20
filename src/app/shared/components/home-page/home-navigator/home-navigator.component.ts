import { Component, OnInit } from '@angular/core';
import { NavigationList } from 'src/app/shared/entities/home-navigation-list';
import { AuthService } from 'src/app/core/auth-service/auth-service';

@Component({
  selector: 'app-home-navigator',
  templateUrl: './home-navigator.component.html',
  styleUrls: ['./home-navigator.component.css'],
})
export class HomeNavigatorComponent implements OnInit {
  //#region Variables

  administrationList: NavigationList[] = [];
  kpiList: NavigationList[] = [];
  designList: NavigationList[] = [];

  //#endregion

  //#region Constructor

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.initLists();
    this.prepareTiles();
  }

  //#endregion

  //#region Actions

  private prepareTiles() {
    let currentRoles = this.authService.getUserRoles()?.split(',') as string[];

    this.kpiList = this.kpiList.filter(
      (l) => this.intersection(l.roles, currentRoles).length > 0
    );
    this.designList = this.designList.filter(
      (l) => this.intersection(l.roles, currentRoles).length > 0
    );
    this.administrationList = this.administrationList.filter(
      (l) => this.intersection(l.roles, currentRoles).length > 0
    );
  }

  private intersection(arr1: string[], arr2: string[]): string[] {
    return arr1.filter((val1) => {
      return arr2.find((val2) => val1 === val2); // (find) once it find a elements match the requested value, it will jump out of the loop.
    });
  }

  private initLists() {
    this.administrationList = [
      {
        name: 'Departments ',
        icon: 'ion ion-ios-world',
        link: '/administration/units',
        roles: ['SUPER_ADMIN'],
      },
      {
        name: 'Users',
        icon: 'ion ion-person-stalker',
        link: '/administration/users',
        roles: ['SUPER_ADMIN'],
      },
      {
        name: 'Tags',
        icon: 'ion ion-pricetags',
        link: '/lookups/tags',
        roles: ['SUPER_ADMIN'],
      },
      {
        name: 'History',
        icon: 'ion ion-filing',
        link: '/administration/audit-trail',
        roles: ['SUPER_ADMIN'],
      },
      {
        name: 'Delegations',
        icon: 'fas fa-handshake-o',
        link: '/administration/delegations',
        roles: ['SUPER_ADMIN', 'KPI_OWNER'],
      },
      {
        name: 'Work-Spaces',
        icon: 'fas fa-object-group',
        link: '/administration/work-space',
        roles: ['SUPER_ADMIN'],
      },
    ];

    this.kpiList = [
      {
        name: 'KPI Templates',
        icon: 'ion ion-stats-bars',
        link: '/kpi/list',
        roles: ['WORK_SPACE_ADMIN'], //, 'DATA_CUSTADION', 'DATA_SPONSER']
      },
      {
        name: 'KPI Copies',
        icon: 'ion ion-ios-copy',
        link: '/kpi-copy/list',
        roles: ['WORK_SPACE_ADMIN', 'KPI_OWNER'],
      },
      {
        name: 'KPI Requests',
        icon: 'ion ion-radio-waves',
        link: '/kpi/request-list',
        roles: ['WORK_SPACE_ADMIN', 'CEO', 'KPI_OWNER'],
      },
      {
        name: 'Reporting',
        icon: 'ion ion-pie-graph',
        link: '/kpi/value-reports',
        roles: ['DATA_CUSTADION', 'DATA_SPONSER', 'KPI_OWNER', 'WORK_SPACE_ADMIN'],
      },
      {
        name: 'Department KPIs',
        icon: 'ion ion-pie-graph',
        link: '/kpi/department-kpis',
        roles: ['KPI_OWNER', 'WORK_SPACE_ADMIN', 'CEO'],
      },
      // Hidden for now
      // {
      //   name: 'Achieved KPIs',
      //   icon: 'ion ion-checkmark-circled',
      //   link: '/kpi/achieved-kpis',
      //   roles: ['DATA_CUSTADION', 'KPI_OWNER', 'DATA_SPONSER'],
      // },
    ];

    this.designList = [
      {
        name: 'Strategies',
        icon: 'ion-android-clipboard',
        link: '/design/strategies',
        roles: ['WORK_SPACE_ADMIN'],
      },
      {
        name: 'Scorecards',
        icon: 'ion ion-ios-bookmarks',
        link: '/design/scorecards',
        roles: ['WORK_SPACE_ADMIN'],
      },
      {
        name: 'Objectives',
        icon: 'ion ion-android-locate',
        link: '/design/objectives',
        roles: ['WORK_SPACE_ADMIN'],
      }
    ];
  }

  //#endregion
}
