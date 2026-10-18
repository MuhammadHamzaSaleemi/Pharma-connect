import { ApiProperty } from '@nestjs/swagger';
import { UserStatusEnum } from '../../../common/enums/user-status.enum';

export class UserStatsDto {
  @ApiProperty({ example: 6 })
  total!: number;

  @ApiProperty({ example: { ACTIVE: 4, INACTIVE: 0, SUSPENDED: 1, PENDING_VERIFICATION: 1 } })
  byStatus!: Record<UserStatusEnum, number>;
}
