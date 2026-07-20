import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-personal-information-management',
  templateUrl: './personal-information-management.component.html',
  styleUrls: ['./personal-information-management.component.css']
})
export class PersonalInformationManagementComponent implements OnInit {

  //#region Variables

  @Input() public modal: any;
  @Output() userUpdatedEvent = new EventEmitter<any>();

  submitted: boolean = false;

  personalInfo: { id: number, firstName: string, lastName: string, userName: string, phoneNumber: string } = { id: 0, firstName: '', lastName: '', userName: '', phoneNumber: '' }
  personalInfoForm = this.formBuilder.group({
    firstName: [this.personalInfo.firstName || null, [Validators.required, Validators.maxLength(100)]],
    lastName: [this.personalInfo.lastName || null, [Validators.required, Validators.maxLength(100)]],
    userName: [this.personalInfo.userName || null, [Validators.required, Validators.maxLength(100)]],
    phoneNumber: [this.personalInfo.userName || null, [Validators.maxLength(100)]]
  });
  get formFileds() { return this.personalInfoForm.controls }

  //#endregion


  //#region Constructor

  constructor(
    private _sharedService: SharedService,
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> { 
    this.personalInfoForm.disable()
  }

  //#endregion


  //#region Events

  onSubmit() {
    this.submitted = true
    if (this.personalInfoForm.invalid) return

    // this.prepareAddUpdateModel()
    this.updateUser();
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['modal']) {
      this.initModal()
      this.initForm()
    }
  }

  //#endregion

  //#region Private Functions

  private initModal() { this.personalInfo = this.modal || this.personalInfo }

  private updateUser() {
    this._sharedService.updatePersonalInfo(this.personalInfo).subscribe({
      error: () => { this._sharedService.errorToaster("Something went wrong") },
      next: () => {
        this.userUpdatedEvent.emit(this.personalInfo)
        this._sharedService.successToaster("updated successfully")
      }
    })
  }

  private prepareAddUpdateModel() {
    this.personalInfo = {
      id: this.personalInfo.id,
      firstName: this.personalInfoForm.value.firstName,
      lastName: this.personalInfoForm.value.lastName,
      phoneNumber: this.personalInfoForm.value.phoneNumber,
      userName: this.personalInfoForm.value.userName
    }
  }

  private initForm() {
    this.personalInfoForm.controls['firstName'].setValue(this.personalInfo.firstName || null)
    this.personalInfoForm.controls['lastName'].setValue(this.personalInfo.lastName || null)
    this.personalInfoForm.controls['userName'].setValue(this.personalInfo.userName || null)
    this.personalInfoForm.controls['phoneNumber'].setValue(this.personalInfo.phoneNumber || null)
  }

  //#endregion

}