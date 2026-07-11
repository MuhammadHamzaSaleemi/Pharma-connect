import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { UserStatusEnum } from '../../../common/enums/user-status.enum';

export class CurrentUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: UserRoleEnum })
  role!: UserRoleEnum;

  @ApiProperty({ enum: UserStatusEnum })
  status!: UserStatusEnum;

  @ApiProperty()
  createdAt!: Date;
}
