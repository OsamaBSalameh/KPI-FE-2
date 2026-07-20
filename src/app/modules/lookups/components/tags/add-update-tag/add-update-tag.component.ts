import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { Tag } from '../../../entities/tag';
import { TagsService } from '../../../services/tags.service';

@Component({
  selector: 'app-add-update-tag',
  templateUrl: './add-update-tag.component.html',
  styleUrls: ['./add-update-tag.component.css']
})
export class AddUpdateTagComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  @Output() tagAddedEvent = new EventEmitter<any>();
  @Output() tagUpdatedEvent = new EventEmitter<any>();

  tag: Tag = new Tag({
    name: undefined,
    id: undefined,
    isEnabled: true
  });

  tagForm = this.formBuilder.group({});
  get formFileds() { return this.tagForm.controls }

  //#endregion


  //#region Constructor

  constructor(
    private tagsService: TagsService,
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
    super.onSubmit()

    if (this.tagForm.invalid) return

    this.tag = new Tag({
      id: this.tag.id,
      name: this.tagForm.value.name
    })

    this.save();
  }

  override save() { super.save() }

  add() { this.addTag() }

  update() { this.updateTag() }

  copy() { throw new Error('Method not implemented.') }
  
  //#endregion


  //#region Private Functions

  private initModal() { this.tag = this.modal?.data || this.tag }

  private addTag() {
    this.tagsService.add(this.tag).subscribe({
      error: () => { 
        this.tagsService.errorToaster("Faild to save")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.tagAddedEvent.emit(this.tag)
        this.tagsService.successToaster("saved successfully")
        this.close()
      }
    })
  }

  private updateTag() {
    this.tagsService.update(this.tag).subscribe({
      error: () => { 
        this.tagsService.errorToaster("Faild to update")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.tagUpdatedEvent.emit(this.tag)
        this.tagsService.successToaster("updated successfully")
        this.close()
      }
    })
  }

  private initForm() {
    let data = this.modal?.data;
    this.tagForm = this.formBuilder.group({
      name: [
        this.tag.name || null, [Validators.required, Validators.maxLength(100)]
      ]
    });
  }

  private disableForm() {
    if (this.view)
      this.tagForm.disable()
  }

  //#endregion

}
