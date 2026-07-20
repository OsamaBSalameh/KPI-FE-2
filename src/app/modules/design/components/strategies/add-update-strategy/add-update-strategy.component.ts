import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import {
  CustomValidator,
  fromDateToNgDate,
  fromNgDateToDate,
  isNullOrUndefined,
} from 'src/app/shared/tools/base-tools';
import { Scorecard } from '../../../entities/classes/scorecard';
import { StrategyScorecard } from '../../../entities/classes/strategies-scorecards';
import {
  Strategy,
  StrategyQuartersSettings,
} from '../../../entities/classes/strategy';
import { ScorecardsService } from '../../../services/scorecards.service';
import { StrategiesService } from '../../../services/strategies.service';

@Component({
  selector: 'app-add-update-strategy',
  templateUrl: './add-update-strategy.component.html',
  styleUrls: ['./add-update-strategy.component.css'],
})
export class AddUpdateStrategyComponent
  extends AddUpdateBaseComponent
  implements OnInit, OnDestroy {
  //#region Variables

  @Output() strategyAddedEvent = new EventEmitter<any>();
  @Output() strategyUpdatedEvent = new EventEmitter<any>();

  strategy: Strategy = new Strategy({});
  weightSumNotEnough: boolean = false;
  scorecards: Scorecard[] = [];
  weightSum: number = 0;

  strategyForm = this.formBuilder.group({
    name: [
      this.strategy.name || null,
      [Validators.required, Validators.maxLength(1000)],
    ],
    startDate: [
      fromDateToNgDate(this.strategy.startDate) || null,
      [Validators.required, CustomValidator.lessThan('endDate')],
    ],
    endDate: [
      fromDateToNgDate(this.strategy.endDate) || null,
      [Validators.required, CustomValidator.greaterThan('startDate')],
    ],
    selectedScorecards: [null, [Validators.required]],
    strategyScorecards: this.formBuilder.array([]),

    firstQuarterSettings: this.formBuilder.group({
      id: [this.strategy.firstQuarterSettingsId || null],
      name: ['Q1'],
      startDate: [
        fromDateToNgDate(this.strategy.firstQuarterSettings?.startDate) || null,
        [Validators.required, CustomValidator.lessThan('endDate')],
      ],
      endDate: [
        fromDateToNgDate(this.strategy.firstQuarterSettings?.endDate) || null,
        [Validators.required, CustomValidator.greaterThan('startDate')],
      ],
      reminderLifespan: [
        this.strategy.firstQuarterSettings?.reminderLifespan || null,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
    }),

    secondQuarterSettings: this.formBuilder.group({
      id: [this.strategy.secondQuarterSettingsId || null],
      name: ['Q2'],
      startDate: [
        fromDateToNgDate(this.strategy.secondQuarterSettings?.startDate) ||
        null,
        [Validators.required, CustomValidator.lessThan('endDate')],
      ],
      endDate: [
        fromDateToNgDate(this.strategy.secondQuarterSettings?.endDate) || null,
        [Validators.required, CustomValidator.greaterThan('startDate')],
      ],
      reminderLifespan: [
        this.strategy.secondQuarterSettings?.reminderLifespan || null,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
    }),

    thirdQuarterSettings: this.formBuilder.group({
      id: [this.strategy.thirdQuarterSettingsId || null],
      name: ['Q3'],
      startDate: [
        fromDateToNgDate(this.strategy.thirdQuarterSettings?.startDate) || null,
        [Validators.required, CustomValidator.lessThan('endDate')],
      ],
      endDate: [
        fromDateToNgDate(this.strategy.thirdQuarterSettings?.endDate) || null,
        [Validators.required, CustomValidator.greaterThan('startDate')],
      ],
      reminderLifespan: [
        this.strategy.thirdQuarterSettings?.reminderLifespan || null,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
    }),

    forthQuarterSettings: this.formBuilder.group({
      id: [this.strategy.forthQuarterSettingsId || null],
      name: ['Q4'],
      startDate: [
        fromDateToNgDate(this.strategy.forthQuarterSettings?.startDate) || null,
        [Validators.required, CustomValidator.lessThan('endDate')],
      ],
      endDate: [
        fromDateToNgDate(this.strategy.forthQuarterSettings?.endDate) || null,
        [Validators.required, CustomValidator.greaterThan('startDate')],
      ],
      reminderLifespan: [
        this.strategy.forthQuarterSettings?.reminderLifespan || null,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
    }),

    yearlySettings: this.formBuilder.group({
      id: [this.strategy.yearlySettingsId || null],
      name: ['Y'],
      startDate: [
        fromDateToNgDate(this.strategy.yearlySettings?.startDate) || null,
        [Validators.required, CustomValidator.lessThan('endDate')],
      ],
      endDate: [
        fromDateToNgDate(this.strategy.yearlySettings?.endDate) || null,
        [Validators.required, CustomValidator.greaterThan('startDate')],
      ],
      reminderLifespan: [
        this.strategy.yearlySettings?.reminderLifespan || null,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
    }),
  });

  get formFields() {
    return this.strategyForm.controls;
  }

  get Q1SettingsformFields() {
    return this.settingsFormFields('firstQuarterSettings');
  }

  get Q2SettingsformFields() {
    return this.settingsFormFields('secondQuarterSettings');
  }

  get Q3SettingsformFields() {
    return this.settingsFormFields('thirdQuarterSettings');
  }

  get Q4SettingsformFields() {
    return this.settingsFormFields('forthQuarterSettings');
  }

  get YSettingsformFields() {
    return this.settingsFormFields('yearlySettings');
  }

  //#endregion

  //#region Constructor

  constructor(
    private strategiesService: StrategiesService,
    private scorecardsService: ScorecardsService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.initModal();

    await this.initScorecards();

    this.initForm();
    this.determineActionType();

    this.disableForm();
  }

  //#endregion

  //#region Events

  override onSubmit() {
    super.onSubmit();

    if (this.checkWeightSum() || this.strategyForm.invalid) return;

    this.prepareAddUpdateModel();
    this.save();
  }

  override save() {
    super.save();
  }

  add() {
    this.addStrategy();
  }

  update() {
    this.updateStrategy();
  }

  copy() {
    this.copyStrategy();
  }

  calculateWeight(event: any) {
    let allWeights = document.getElementsByClassName('dummyWeightClass') as any;

    this.weightSum = 0;
    for (const weight of allWeights) {
      if (!isNullOrUndefined(weight.value) && weight.value != '') {
        this.weightSum += Number.parseInt(weight.value);
        this.checkWeightSum();
      }
    }
  }

  //#endregion

  //#region Selection

  onScorecardSelect(scorecard: any) {
    let strategyScorecard: StrategyScorecard = new StrategyScorecard({
      scorecardId: scorecard?.id,
      strategyId: undefined,
      weight: undefined,
      id: undefined,
      isEnabled: true,
    });

    this.addStrategyScorecard(strategyScorecard, scorecard.name);
  }

  onDeSelectScorecard(scorecard: any) {
    let index = this.getGroupIndex(scorecard.id);
    this.removeStrategyScorecard(index);
  }

  onDeSelectAll() {
    let groups = this.strategyScorecards();
    while (groups.length !== 0) {
      groups.removeAt(0);
    }
  }

  onSelectAllScorecards(scorecards: any[]) {
    let currentScorecards = this.strategyScorecardFormGroups().map(
      (scorecard) => {
        return scorecard.controls['KPIId'].value;
      }
    );

    let unselectedScorecards = scorecards.filter(
      (scorecard) => !currentScorecards.includes(scorecard.id)
    );
    unselectedScorecards.forEach((scorecard) => {
      this.onScorecardSelect(scorecard);
    });
  }

  //#endregion

  //#region strategy Scorecards [Form Array]

  addStrategyScorecard(data: any = null, scorecaredName: string | undefined) {
    this.strategyScorecards().push(
      this.newStrategyScorecard(data, scorecaredName)
    );
  }

  removeStrategyScorecard(i: number) {
    this.strategyScorecards().removeAt(i);
  }

  strategyScorecards(): FormArray {
    return this.strategyForm.get('strategyScorecards') as FormArray;
  }

  strategyScorecardFormGroups(): FormGroup[] {
    return (this.strategyForm.get('strategyScorecards') as FormArray)
      .controls as FormGroup[];
  }

  newStrategyScorecard(
    data: StrategyScorecard,
    scorecaredName: string | undefined
  ): FormGroup {
    return this.formBuilder.group({
      id: [data?.id || null, []],
      strategyId: [data?.strategyId || null, []],
      scorecaredName: [scorecaredName, []],
      scorecardId: [
        data?.scorecardId || 0,
        [Validators.required, Validators.min(1)],
      ],
      weight: [data?.weight || null, [Validators.required]],
    });
  }

  //#endregion

  //#region Private Functions

  private settingsFormFields(settingsName: string) {
    let settingsForm = this.strategyForm.controls[settingsName] as FormGroup;
    return settingsForm.controls;
  }

  private initModal() {
    this.strategy = this.modal?.data || this.strategy;
  }

  private addStrategy() {
    this.strategiesService.add(this.strategy).subscribe({
      error: () => {
        this.strategiesService.errorToaster('Faild to save');
        this.addUpdateState = 2;
      },
      next: () => {
        this.addUpdateState = 1;
        this.strategyAddedEvent.emit(this.strategy);
        this.strategiesService.successToaster('saved successfully');
        this.close();
      },
    });
  }

  private updateStrategy() {
    this.strategiesService.update(this.strategy).subscribe({
      error: () => {
        this.strategiesService.errorToaster('Faild to update');
        this.addUpdateState = 2;
        this.close();
      },
      next: () => {
        this.addUpdateState = 1;
        this.strategyUpdatedEvent.emit(this.strategy);
        this.strategiesService.successToaster('updated successfully');
        this.close();
      },
    });
  }

  private copyStrategy() {
    this.strategy.id = undefined;
    this.strategy.firstQuarterSettings?.resetId();
    this.strategy.firstQuarterSettingsId = undefined;

    this.strategy.secondQuarterSettings?.resetId();
    this.strategy.secondQuarterSettingsId = undefined;

    this.strategy.thirdQuarterSettings?.resetId();
    this.strategy.thirdQuarterSettingsId = undefined;

    this.strategy.forthQuarterSettings?.resetId();
    this.strategy.forthQuarterSettingsId = undefined;

    this.strategy.yearlySettings?.resetId();
    this.strategy.yearlySettingsId = undefined;


    this.strategy.strategyScorecards?.map((s) => (s.id = undefined));
    this.strategiesService.add(this.strategy).subscribe({
      error: () => {
        this.strategiesService.errorToaster('Faild to copy');
        this.addUpdateState = 2;
      },
      next: () => {
        this.addUpdateState = 1;
        this.strategyUpdatedEvent.emit(this.strategy);
        this.strategiesService.successToaster('copied successfully');
        this.close();
      },
    });
  }

  private initForm() {
    let scorecards = this.scorecards.filter((sco) =>
      this.strategy.strategyScorecards
        ?.map((sco) => sco.scorecardId)
        .includes(sco.id)
    );

    this.strategyForm.patchValue({
      selectedScorecards: scorecards,
      name: this.strategy.name || null,
      startDate: fromDateToNgDate(this.strategy.startDate) || null,
      endDate: fromDateToNgDate(this.strategy.endDate) || null,
    });
    // this.strategyForm.controls['selectedScorecards'].setValue(scorecards)
    // this.strategyForm.controls['name'].setValue(this.strategy.name || null)
    // this.strategyForm.controls['startDate'].setValue(fromDateToNgDate(this.strategy.startDate) || null)
    // this.strategyForm.controls['endDate'].setValue(fromDateToNgDate(this.strategy.endDate) || null)

    this.strategy?.strategyScorecards?.forEach((element: any) => {
      let scorecard = this.scorecards.find(
        (sco) => sco.id == element.scorecardId
      );
      this.addStrategyScorecard(element, scorecard?.name);
      this.calculateWeightViaForm();
    });

    this.strategyForm.controls['firstQuarterSettings'].patchValue({
      id: this.strategy.firstQuarterSettingsId || null,
      name: 'Q1',
      startDate:
        fromDateToNgDate(this.strategy.firstQuarterSettings?.startDate) || null,
      endDate:
        fromDateToNgDate(this.strategy.firstQuarterSettings?.endDate) || null,
      reminderLifespan:
        this.strategy.firstQuarterSettings?.reminderLifespan || null,
    });

    this.strategyForm.controls['secondQuarterSettings'].patchValue({
      id: this.strategy.secondQuarterSettingsId || null,
      name: 'Q2',
      startDate:
        fromDateToNgDate(this.strategy.secondQuarterSettings?.startDate) ||
        null,
      endDate:
        fromDateToNgDate(this.strategy.secondQuarterSettings?.endDate) || null,
      reminderLifespan:
        this.strategy.secondQuarterSettings?.reminderLifespan || null,
    });

    this.strategyForm.controls['thirdQuarterSettings'].patchValue({
      id: this.strategy.thirdQuarterSettingsId || null,
      name: 'Q3',
      startDate:
        fromDateToNgDate(this.strategy.thirdQuarterSettings?.startDate) || null,
      endDate:
        fromDateToNgDate(this.strategy.thirdQuarterSettings?.endDate) || null,
      reminderLifespan:
        this.strategy.thirdQuarterSettings?.reminderLifespan || null,
    });

    this.strategyForm.controls['forthQuarterSettings'].patchValue({
      id: this.strategy.forthQuarterSettingsId || null,
      name: 'Q4',
      startDate:
        fromDateToNgDate(this.strategy.forthQuarterSettings?.startDate) || null,
      endDate:
        fromDateToNgDate(this.strategy.forthQuarterSettings?.endDate) || null,
      reminderLifespan:
        this.strategy.forthQuarterSettings?.reminderLifespan || null,
    });

    this.strategyForm.controls['yearlySettings'].patchValue({
      id: this.strategy.yearlySettingsId || null,
      name: 'Y',
      startDate:
        fromDateToNgDate(this.strategy.yearlySettings?.startDate) || null,
      endDate: fromDateToNgDate(this.strategy.yearlySettings?.endDate) || null,
      reminderLifespan: this.strategy.yearlySettings?.reminderLifespan || null,
    });
  }

  private async initScorecards() {
    let scorecardResult = this.scorecardsService
      .get()
      .pipe(takeUntil(this.destroy$));
    this.scorecards = (await lastValueFrom(
      scorecardResult
    )) as unknown as Scorecard[];
  }

  private prepareAddUpdateModel() {
    let strategyScorecards = this.strategyScorecards().controls.map(
      (element) => {
        return element.value;
      }
    );

    this.strategy = new Strategy({
      id: this.strategy.id,
      name: this.strategyForm.value.name,
      startDate: fromNgDateToDate(this.strategyForm.value.startDate),
      endDate: fromNgDateToDate(this.strategyForm.value.endDate),
      strategyScorecards: strategyScorecards,
      statusId: this.strategy.statusId,

      firstQuarterSettings: new StrategyQuartersSettings({
        id: this.strategyForm.value.firstQuarterSettings.id,
        name: this.strategyForm.value.firstQuarterSettings.name,
        reminderLifespan:
          this.strategyForm.value.firstQuarterSettings.reminderLifespan,
        startDate: fromNgDateToDate(
          this.strategyForm.value.firstQuarterSettings.startDate
        ),
        endDate: fromNgDateToDate(
          this.strategyForm.value.firstQuarterSettings.endDate
        ),
      }),

      secondQuarterSettings: new StrategyQuartersSettings({
        id: this.strategyForm.value.secondQuarterSettings.id,
        name: this.strategyForm.value.secondQuarterSettings.name,
        reminderLifespan:
          this.strategyForm.value.secondQuarterSettings.reminderLifespan,
        startDate: fromNgDateToDate(
          this.strategyForm.value.secondQuarterSettings.startDate
        ),
        endDate: fromNgDateToDate(
          this.strategyForm.value.secondQuarterSettings.endDate
        ),
      }),

      thirdQuarterSettings: new StrategyQuartersSettings({
        id: this.strategyForm.value.thirdQuarterSettings.id,
        name: this.strategyForm.value.thirdQuarterSettings.name,
        reminderLifespan:
          this.strategyForm.value.thirdQuarterSettings.reminderLifespan,
        startDate: fromNgDateToDate(
          this.strategyForm.value.thirdQuarterSettings.startDate
        ),
        endDate: fromNgDateToDate(
          this.strategyForm.value.thirdQuarterSettings.endDate
        ),
      }),

      forthQuarterSettings: new StrategyQuartersSettings({
        id: this.strategyForm.value.forthQuarterSettings.id,
        name: this.strategyForm.value.forthQuarterSettings.name,
        reminderLifespan:
          this.strategyForm.value.forthQuarterSettings.reminderLifespan,
        startDate: fromNgDateToDate(
          this.strategyForm.value.forthQuarterSettings.startDate
        ),
        endDate: fromNgDateToDate(
          this.strategyForm.value.forthQuarterSettings.endDate
        ),
      }),

      yearlySettings: new StrategyQuartersSettings({
        id: this.strategyForm.value.yearlySettings.id,
        name: this.strategyForm.value.yearlySettings.name,
        reminderLifespan:
          this.strategyForm.value.yearlySettings.reminderLifespan,
        startDate: fromNgDateToDate(
          this.strategyForm.value.yearlySettings.startDate
        ),
        endDate: fromNgDateToDate(
          this.strategyForm.value.yearlySettings.endDate
        ),
      }),
    });
  }

  private getGroupIndex(strategyId: number): any {
    let groups = this.strategyScorecardFormGroups();
    var value = null;

    groups.forEach((group, index) => {
      Object.keys(group.controls).forEach((key) => {
        if (
          key == 'strategyId' &&
          group.controls['strategyId'].value == strategyId
        )
          value = index;
      });
    });

    return value;
  }

  private checkWeightSum() {
    let weightValues = 0;
    let groups = this.strategyScorecardFormGroups();

    groups.forEach((group) => {
      Object.keys(group.controls).forEach((key) => {
        if (key == 'weight') {
          let control = group.get(key) as AbstractControl;
          weightValues += control.value;
        }
      });
    });

    if (weightValues != 100) this.weightSumNotEnough = true;
    else this.weightSumNotEnough = false;

    return this.weightSumNotEnough;
  }

  private calculateWeightViaForm() {
    let weightValues = 0;
    let groups = this.strategyScorecardFormGroups();

    groups.forEach((group) => {
      Object.keys(group.controls).forEach((key) => {
        if (key == 'weight') {
          let control = group.get(key) as AbstractControl;
          weightValues += control.value;
        }
      });
    });
    this.weightSum = weightValues;
  }

  private disableForm() {
    if (this.view) this.strategyForm.disable();
  }

  //#endregion
}
