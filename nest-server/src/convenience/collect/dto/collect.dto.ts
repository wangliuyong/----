import { IsArray, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

/** 收藏分页 */
export class CollectQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}

/** 收藏信息 */
export class CollectDto {
  @Type(() => Number)
  @IsInt()
  infoId!: number;
}

/** 举报信息 */
export class ReportDto {
  @Type(() => Number)
  @IsInt()
  infoId!: number;

  @IsIn(['SPAM', 'FRAUD', 'ILLEGAL', 'OTHER'])
  reportType!: 'SPAM' | 'FRAUD' | 'ILLEGAL' | 'OTHER';

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content!: string;
}
