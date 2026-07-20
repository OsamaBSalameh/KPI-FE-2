import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { AttachmentType } from "../enums/attachment-type";

export class Attachment extends BaseEntity<Attachment> {

  name: string | undefined

  size: string | undefined

  type: string | undefined

  path: string | undefined

  attachmentType: AttachmentType | undefined

  attachedToId: number | undefined

  file: File | undefined

  constructor(model?: Partial<Attachment>) {
    super(model);
  }
}
