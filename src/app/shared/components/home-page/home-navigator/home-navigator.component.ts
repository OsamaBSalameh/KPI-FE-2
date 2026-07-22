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
  lookupsList: NavigationList[] = [];

  //#endregion

  //#region Constructor

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // this.initLists();
    this.initLists2();
    this.prepareTiles();
  }

  //#endregion

  //#region Actions

  private prepareTiles() {
    let currentRoles = this.authService.getUserRoles()?.split(',') as string[];

    this.kpiList = this.kpiList.filter((l) => this.intersection(l.roles, currentRoles).length > 0);
    this.designList = this.designList.filter((l) => this.intersection(l.roles, currentRoles).length > 0);
    this.administrationList = this.administrationList.filter((l) => this.intersection(l.roles, currentRoles).length > 0);
    this.lookupsList = this.lookupsList.filter((l) => this.intersection(l.roles, currentRoles).length > 0);
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

  private initLists2() {
    this.administrationList = [
      {
        name: 'Departments',
        icon: 'fas fa-building',
        link: '/administration/units',
        roles: ['SUPER_ADMIN'],
      },
      {
        name: 'Work-Spaces',
        icon: 'fas fa-object-group',
        link: '/administration/work-space',
        roles: ['SUPER_ADMIN'],
      },
      {
        name: 'Users',
        icon: 'fas fa-user-shield',
        link: '/administration/users',
        roles: ['SUPER_ADMIN'],
      },
      {
        name: 'Delegations',
        icon: 'fas fa-handshake',
        link: '/administration/delegations',
        roles: ['SUPER_ADMIN', 'KPI_OWNER'],
      },
      {
        name: 'Audit Trail',
        icon: 'fas fa-history',
        link: '/administration/audit-trail',
        roles: ['SUPER_ADMIN'],
      },
    ];

    this.lookupsList = [
      {
        name: 'Tags',
        icon: 'fas fa-tags',
        link: '/lookups/tags',
        roles: ['SUPER_ADMIN'],
      },
      {
        name: 'Prospectives',
        icon: 'fas fa-eye',
        link: '/lookups/prospectives',
        roles: ['SUPER_ADMIN', 'WORK_SPACE_ADMIN'],
      },
      {
        name: 'Measurement Units',
        icon: 'fas fa-ruler-combined',
        link: '/lookups/measurement-units',
        roles: ['SUPER_ADMIN', 'WORK_SPACE_ADMIN'],
      },
      {
        name: 'Frequencies',
        icon: 'fas fa-calendar-alt',
        link: '/lookups/frequencies',
        roles: ['SUPER_ADMIN', 'WORK_SPACE_ADMIN'],
      },
    ];

    this.designList = [
      {
        name: 'Objectives',
        icon: 'fas fa-bullseye',
        link: '/design/objectives',
        roles: ['WORK_SPACE_ADMIN'],
      },
      {
        name: 'Scorecards',
        icon: 'fas fa-clipboard-check',
        link: '/design/scorecards',
        roles: ['WORK_SPACE_ADMIN'],
      },
      {
        name: 'Strategies',
        icon: 'fas fa-lightbulb',
        link: '/design/strategies',
        roles: ['WORK_SPACE_ADMIN'],
      }
    ];

    this.kpiList = [
      {
        name: 'KPI Templates',
        icon: 'fas fa-file-alt',
        link: '/kpi/list',
        roles: ['WORK_SPACE_ADMIN'],
      },
      {
        name: 'KPI Requests',
        icon: 'fas fa-file-signature',
        link: '/kpi/request-list',
        roles: ['WORK_SPACE_ADMIN', 'CEO', 'KPI_OWNER'],
      },
      {
        name: 'KPI Copies',
        icon: 'fas fa-copy',
        link: '/kpi-copy/list',
        roles: ['WORK_SPACE_ADMIN', 'KPI_OWNER'],
      },
      {
        name: 'Reporting',
        icon: 'fas fa-chart-bar',
        link: '/kpi/value-reports',
        roles: ['DATA_CUSTODIAN', 'DATA_SPONSOR', 'KPI_OWNER', 'WORK_SPACE_ADMIN'],
      },
      {
        name: 'Department KPIs',
        icon: 'fas fa-chart-pie',
        link: '/kpi/department-kpis',
        roles: ['KPI_OWNER', 'WORK_SPACE_ADMIN', 'CEO'],
      }
    ];
  }

  //#endregion
}
