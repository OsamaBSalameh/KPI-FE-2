import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { UserRoles } from 'src/app/core/base-entity/base-enums';
import { UnitKPI } from 'src/app/modules/kpi/entities/classes/unit-kpi';
import { UnitKPIRequestService } from 'src/app/modules/kpi/services/unit-kpi-requests.service';
import { PaginationItem } from 'src/app/shared/entities/pagination/pagination-item';
import { UnitKPIStatusEnum } from 'src/app/shared/enums/unit-kpi-status';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = true;
  hasData = false;

  achievementOverview = {
    achieved: 0,
    target: 100,
    completed: 0,
    remaining: 0
  };

  departmentPerformance: Array<{ name: string; value: number; color: string }> = [];

  trendSeries: number[] = [];
  ringRadius = 54;
  ringCircumference = 2 * Math.PI * this.ringRadius;

  summaryCards = [
    {
      title: 'Active KPIs',
      value: '0',
      change: 'Loading...',
      description: 'Current KPI records available to review',
      icon: 'fas fa-chart-line',
      color: 'primary'
    },
    {
      title: 'Achieved',
      value: '0',
      change: '0% completed',
      description: 'KPIs marked as achieved',
      icon: 'fas fa-check-circle',
      color: 'success'
    },
    {
      title: 'Pending Review',
      value: '0',
      change: 'Awaiting action',
      description: 'KPIs still pending attention',
      icon: 'fas fa-clock',
      color: 'warning'
    }
  ];

  quickActions = [
    { title: 'Open KPI Templates', description: 'Create and manage KPI definitions', link: '/kpi/list', icon: 'fas fa-layer-group' },
    { title: 'Review Requests', description: 'Approve or return pending requests', link: '/kpi/request-list', icon: 'fas fa-clipboard-list' },
    { title: 'View Reports', description: 'Monitor submitted KPI values and trends', link: '/kpi/value-reports', icon: 'fas fa-chart-pie' }
  ];

  attentionItems: Array<{ title: string; text: string }> = [];

  recentActivity: Array<{ title: string; time: string }> = [];
  topPerformers: Array<{ name: string; value: number; status: string }> = [];
  riskItems: Array<{ title: string; severity: string; text: string }> = [];

  upcomingDeadlines = [
    { title: 'Weekly KPI submission', date: 'Today • 5:00 PM' },
    { title: 'Request review cycle', date: 'Tomorrow • 10:30 AM' },
    { title: 'Quarterly performance review', date: 'Friday • 2:00 PM' }
  ];

  constructor(
    private unitKpiRequestService: UnitKPIRequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCircleOffset(percent: number): number {
    return this.ringCircumference - (percent / 100) * this.ringCircumference;
  }

  getTrendPoints(values: number[]): string {
    if (!values.length) {
      return '';
    }

    const width = 240;
    const height = 90;
    const max = Math.max(...values) + 10;
    const min = Math.min(...values) - 10;
    const range = max - min || 1;

    return values.map((value, index) => {
      const x = 10 + index * ((width - 20) / Math.max(values.length - 1, 1));
      const y = height - ((value - min) / range) * (height - 20) - 10;
      return `${x},${y}`;
    }).join(' ');
  }

  private loadDashboardData(): void {
    const roles = this.getUserRoles();
    const paginationItem: PaginationItem = {
      searchValue: '',
      strategyId: 0,
      pageNumber: 1,
      pageSize: 100
    };

    this.isLoading = true;

    if (roles.includes(UserRoles.WORK_SPACE_ADMIN)) {
      this.unitKpiRequestService
        .unitKPIsForWorkSpaceAdmin({
          paignationRequest: paginationItem,
          organizationUnitId: this.getOrganizationUnitId(),
          unitKPIStatus: 0
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => this.buildDashboard(this.extractItems(response)),
          error: () => this.buildDashboard([])
        });
      return;
    }

    if (roles.includes(UserRoles.KPI_OWNER)) {
      this.unitKpiRequestService
        .unitKPIsForOwner({
          paignationRequest: paginationItem,
          userId: this.getCurrentUserId(),
          unitKPIStatus: 0
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => this.buildDashboard(this.extractItems(response)),
          error: () => this.buildDashboard([])
        });
      return;
    }

    if (roles.includes(UserRoles.DATA_CUSTADION)) {
      this.unitKpiRequestService
        .unitKPIsForDataCustodian({
          paignationRequest: paginationItem,
          userId: this.getCurrentUserId(),
          unitKPIStatus: 0
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => this.buildDashboard(this.extractItems(response)),
          error: () => this.buildDashboard([])
        });
      return;
    }

    if (roles.includes(UserRoles.DATA_SPONSER)) {
      this.unitKpiRequestService
        .unitKPIsForDataSponser({
          paignationRequest: paginationItem,
          userId: this.getCurrentUserId(),
          unitKPIStatus: 0
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => this.buildDashboard(this.extractItems(response)),
          error: () => this.buildDashboard([])
        });
      return;
    }

    this.unitKpiRequestService
      .viewPaginatedFilteredUnitKPIs({
        paignationRequest: paginationItem,
        organizationUnitId: this.getOrganizationUnitId(),
        unitKPIStatus: 0
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => this.buildDashboard(this.extractItems(response)),
        error: () => this.buildDashboard([])
      });
  }

  private extractItems(response: any): UnitKPI[] {
    if (Array.isArray(response)) {
      return response as UnitKPI[];
    }

    if (response?.items) {
      return response.items as UnitKPI[];
    }

    return [];
  }

  private buildDashboard(kpis: UnitKPI[]): void {
    this.hasData = kpis.length > 0;

    const total = kpis.length;
    const achieved = kpis.filter((kpi) => this.isAchieved(kpi)).length;
    const reported = kpis.filter((kpi) => this.hasReportedValue(kpi)).length;
    const pending = Math.max(total - achieved, 0);
    const achievementPercent = total > 0 ? Math.round((achieved / total) * 100) : 0;

    this.achievementOverview = {
      achieved: achievementPercent,
      target: 100,
      completed: reported,
      remaining: Math.max(total - reported, 0)
    };

    this.summaryCards = [
      {
        title: 'Active KPIs',
        value: total.toString(),
        change: total > 0 ? `${achievementPercent}% achieved` : 'No data yet',
        description: 'Current KPI records available to review',
        icon: 'fas fa-chart-line',
        color: 'primary'
      },
      {
        title: 'Achieved',
        value: achieved.toString(),
        change: `${achievementPercent}% of current KPIs`,
        description: 'KPIs marked as achieved',
        icon: 'fas fa-check-circle',
        color: 'success'
      },
      {
        title: 'Pending Review',
        value: pending.toString(),
        change: pending > 0 ? `${pending} need follow-up` : 'All clear',
        description: 'KPIs still pending attention',
        icon: 'fas fa-clock',
        color: 'warning'
      }
    ];

    const colors = ['#1971c2', '#10b981', '#f59e0b', '#6366f1'];
    this.departmentPerformance = this.groupByDepartment(kpis).map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    }));

    this.trendSeries = kpis.slice(0, 6).map((kpi) => this.getKpiProgress(kpi));

    this.attentionItems = kpis
      .filter((kpi) => !this.isAchieved(kpi))
      .slice(0, 3)
      .map((kpi) => ({
        title: this.getKpiName(kpi),
        text: this.hasReportedValue(kpi)
          ? 'Recently updated and still needs review.'
          : 'No reported value yet and may require follow-up.'
      }));

    if (!this.attentionItems.length) {
      this.attentionItems = [{
        title: 'No urgent actions',
        text: 'All current KPI records look up to date.'
      }];
    }

    this.recentActivity = kpis.slice(0, 3).map((kpi) => ({
      title: this.getKpiName(kpi),
      time: this.isAchieved(kpi) ? 'Achieved' : 'Pending review'
    }));

    this.topPerformers = kpis
      .slice()
      .sort((a, b) => this.getKpiProgress(b) - this.getKpiProgress(a))
      .slice(0, 3)
      .map((kpi) => ({
        name: this.getKpiName(kpi),
        value: this.getKpiProgress(kpi),
        status: this.isAchieved(kpi) ? 'On track' : 'Needs follow-up'
      }));

    this.riskItems = kpis
      .filter((kpi) => !this.isAchieved(kpi) && this.getKpiProgress(kpi) < 70)
      .slice(0, 3)
      .map((kpi) => ({
        title: this.getKpiName(kpi),
        severity: this.getKpiProgress(kpi) < 40 ? 'High' : 'Medium',
        text: this.hasReportedValue(kpi)
          ? 'Current progress is below the expected target.'
          : 'No reported value has been captured yet.'
      }));

    if (!this.riskItems.length) {
      this.riskItems = [{
        title: 'No risk signals',
        severity: 'Low',
        text: 'The current KPI set appears healthy and on track.'
      }];
    }

    this.isLoading = false;
  }

  private getUserRoles(): string[] {
    return (this.authService.getUserRoles()?.split(',') || []).filter(Boolean);
  }

  private getCurrentUserId(): number {
    const userId = this.authService.getUserId();
    return Number.parseInt(userId || '0', 10);
  }

  private getOrganizationUnitId(): number {
    const userInfo = this.authService.getUserInfo() as any;
    return Number.parseInt(userInfo?.organizationUnitId || '0', 10);
  }

  private isAchieved(kpi: UnitKPI): boolean {
    if (kpi.isAchieved === true) {
      return true;
    }

    const statusCode = (kpi as any).statusCode ?? (kpi as any).status?.code ?? (kpi as any).status?.id;
    if (statusCode === UnitKPIStatusEnum.ApprovedByKpiOwner || statusCode === 7) {
      return true;
    }

    const statusValue = (kpi.status?.value || '').toString().toLowerCase();
    return statusValue.includes('achieved') || statusValue.includes('approved');
  }

  private hasReportedValue(kpi: UnitKPI): boolean {
    return (kpi.values?.length || 0) > 0;
  }

  private getKpiProgress(kpi: UnitKPI): number {
    const latestValue = this.getLatestReportedValue(kpi);
    if (latestValue !== null && kpi.target && kpi.target > 0) {
      return Math.min(100, Math.round((latestValue / kpi.target) * 100));
    }

    return this.isAchieved(kpi) ? 100 : 0;
  }

  private getLatestReportedValue(kpi: UnitKPI): number | null {
    const values = kpi.values || [];
    if (!values.length) {
      return null;
    }

    const latest = values.slice().sort((a, b) => (b.order || 0) - (a.order || 0))[0];
    return typeof latest.value === 'number' ? latest.value : null;
  }

  private groupByDepartment(kpis: UnitKPI[]): Array<{ name: string; value: number }> {
    const groups = new Map<string, { total: number; count: number }>();

    kpis.forEach((kpi) => {
      const name = this.getDepartmentName(kpi);
      const current = groups.get(name) || { total: 0, count: 0 };
      current.total += this.getKpiProgress(kpi);
      current.count += 1;
      groups.set(name, current);
    });

    return Array.from(groups.entries()).map(([name, data]) => ({
      name,
      value: data.count ? Math.round(data.total / data.count) : 0
    })).slice(0, 4);
  }

  private getDepartmentName(kpi: UnitKPI): string {
    const unitName = kpi.unitKPIRequest?.organizationUnit?.name || kpi.unitKPIRequest?.organizationUnit?.name;
    if (unitName) {
      return unitName;
    }

    return kpi.ownerName || 'Unassigned';
  }

  private getKpiName(kpi: UnitKPI): string {
    return (kpi.kpiCopy?.name || kpi.kpiCopy?.name || 'KPI record').toString();
  }
}
