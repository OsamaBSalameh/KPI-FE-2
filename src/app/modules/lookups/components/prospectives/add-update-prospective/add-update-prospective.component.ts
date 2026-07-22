import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { Prospective } from '../../../entities/lookups-entities';
import { ProspectivesService } from '../../../services/lookups.service';

@Component({
  selector: 'app-add-update-prospective',
  templateUrl: './add-update-prospective.component.html',
  styleUrls: ['./add-update-prospective.component.css']
})
export class AddUpdateProspectiveComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  @Output() prospectiveAddedEvent = new EventEmitter<any>();
  @Output() prospectiveUpdatedEvent = new EventEmitter<any>();

  prospective: Prospective = new Prospective({
    description: undefined,
    name: undefined,
    id: undefined,
    isEnabled: true
  });

  prospectiveForm = this.formBuilder.group({});
  get formFileds() { return this.prospectiveForm.controls }

  //#endregion


  //#region Constructor

  constructor(
    private prospectivesService: ProspectivesService,
    private formBuilder: FormBuilder
  ) {
    super()
  }

  override ngOnDestroy(): void { super.ngOnDestroy() }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    this.initModal()

    this.initForm()
    this.determineActionType();

    this.disableForm()
  }

  //#endregion


  //#region Events

  override onSubmit() {
    debugger
    super.onSubmit()

    if (this.prospectiveForm.invalid) return

    this.prospective = new Prospective({
      id: this.prospective.id,
      name: this.prospectiveForm.value.name,
      description: this.prospectiveForm.value.description
    })

    this.save();
  }

  override save() { super.save() }

  add() { this.addProspective() }

  update() { this.updateProspective() }

  copy() { throw new Error('Method not implemented.') }
  
  //#endregion


  //#region Private Functions

  private initModal() { this.prospective = this.modal?.data || this.prospective }

  private addProspective() {
    this.prospectivesService.add(this.prospective).subscribe({
      error: () => { 
        this.prospectivesService.errorToaster("Faild to save")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.prospectiveAddedEvent.emit(this.prospective)
        this.prospectivesService.successToaster("saved successfully")
        this.close()
      }
    })
  }

  private updateProspective() {
    this.prospectivesService.update(this.prospective).subscribe({
      error: () => { 
        this.prospectivesService.errorToaster("Faild to update")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.prospectiveUpdatedEvent.emit(this.prospective)
        this.prospectivesService.successToaster("updated successfully")
        this.close()
      }
    })
  }

  private initForm() {
    let data = this.modal?.data;
    this.prospectiveForm = this.formBuilder.group({
      name: [ this.prospective.name || null, [Validators.required, Validators.maxLength(100)]],
      description: [ this.prospective.description || null, [Validators.required, Validators.maxLength(100)]]
    });
  }

  private disableForm() {
    if (this.view)
      this.prospectiveForm.disable()
  }

  //#endregion

}
