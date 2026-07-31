import { ApiProperty } from '@nestjs/swagger';

class BulkUploadRowErrorDto {
  @ApiProperty({ example: 5 })
  row!: number;

  @ApiProperty({ example: 'title should not be empty' })
  message!: string;
}

export class BulkUploadResultDto {
  @ApiProperty({ example: 10 })
  totalRows!: number;

  @ApiProperty({ example: 8 })
  created!: number;

  @ApiProperty({ example: 2 })
  failed!: number;

  @ApiProperty({ type: [BulkUploadRowErrorDto] })
  errors!: BulkUploadRowErrorDto[];
}
