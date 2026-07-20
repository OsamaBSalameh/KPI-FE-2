import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuditTrail } from '../../entities/audit-trail';

@Component({
  selector: 'app-view-audit-trail',
  templateUrl: './view-audit-trail.component.html',
  styleUrls: ['./view-audit-trail.component.css']
})
export class ViewAuditTrailComponent implements OnInit {

  //#region Variables

  @Input() public modal: any;

  auditTrail: AuditTrail = new AuditTrail({});

  auditTrailForm = this.formBuilder.group({
    actionName: [null, []],
    type: [null, []],
    tableName: [null, []],
    oldValues: [null, []],
    newValues: [null, []],
    actionBy: [null, []]
  });
  get formFileds() { return this.auditTrailForm.controls }

  //#endregion


  //#region Constructor

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initModal()
    this.initForm()
  }

  //#endregion


  //#region Events

  close() { this.modal.modalReference.close() }

  //#endregion


  //#region Private Functions

  private initModal() { this.auditTrail = this.modal?.data || this.auditTrail }

  private initForm() {
    this.auditTrailForm = this.formBuilder.group({
      actionName: [this.auditTrail.actionName || null, []],
      type: [this.auditTrail.type || null, []],
      tableName: [this.auditTrail.tableName || null, []],
      oldValues: [JSON.parse(this.auditTrail.oldValues as string) || null, []],
      newValues: [JSON.parse(this.auditTrail.newValues as string) || null, []],
      actionBy: [`${this.auditTrail.actionBy?.firstName} ${this.auditTrail.actionBy?.lastName}` || null, []]
    });

    this.auditTrailForm.disable()
  }

  //#endregion

}
