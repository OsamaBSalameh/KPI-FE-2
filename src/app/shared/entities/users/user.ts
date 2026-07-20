import { BaseEntity } from 'src/app/core/base-entity/base-entity';
import { Unit } from 'src/app/modules/administration/components/entities/unit';
import { UserPermissionGroup } from 'src/app/modules/administration/components/entities/user-permission-group';
import { isNullOrUndefined } from '../../tools/base-tools';

export class User extends BaseEntity<User> {
  firstName: string | undefined;
  lastName: string | undefined;

  email: string | undefined;
  isManager: boolean | undefined;

  workSpaceId: number | undefined;

  userName: string | undefined;

  fullName: string | undefined;
  name: string | undefined; // Used for filling dropdown settings
  profilePicturePath: string | undefined;
  thumbnailPhoto: string | undefined;

  userPermissionGroups: UserPermissionGroup[] | undefined;
  organizationUnitId: number | undefined;
  organizationUnit: Unit | undefined;

  isSystemUserEnabled: boolean | undefined;

  constructor(model?: Partial<User>) {
    super(model);
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.profilePicturePath = isNullOrUndefined(this.profilePicturePath)
      ? '../../../../assets/images/userImage2.png'
      : this.profilePicturePath;
    this.thumbnailPhoto = isNullOrUndefined(this.thumbnailPhoto)
      ? '../../../../assets/images/userImage2.png'
      : 'data:image/png;base64,' + this.thumbnailPhoto;
  }
}
