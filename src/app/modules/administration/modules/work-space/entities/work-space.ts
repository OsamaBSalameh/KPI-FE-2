import { BaseEntity } from 'src/app/core/base-entity/base-entity';
import { User } from 'src/app/shared/entities/users/user';
import { Unit } from '../../../components/entities/unit';

export class WorkSpace extends BaseEntity<WorkSpace> {

  name: string | undefined;

  logo_SVG: string | undefined;
  logo_SVG_VIEW: string |undefined;
  
  logo_Name: string | undefined;
  logo_Description: string | undefined

  adminList: User[] | undefined

  departmentId: number | undefined
  department: Unit | undefined;


  constructor(model?: Partial<WorkSpace>) {
    super(model);
  }
}
