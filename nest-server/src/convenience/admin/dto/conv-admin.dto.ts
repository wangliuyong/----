import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/** 管理端分页基类 */
export class AdminPageQueryDto {
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

/** 便民信息管理列表查询 */
export class AdminCityInfoQueryDto extends AdminPageQueryDto {
  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  auditStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;
}

/** 审核便民信息 */
export class AdminCityInfoAuditDto {
  @IsIn(['APPROVED', 'REJECTED'])
  auditStatus!: 'APPROVED' | 'REJECTED';
}

/** C 端用户管理列表 */
export class AdminConvUserQueryDto extends AdminPageQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsIn(['USER', 'MERCHANT', 'ADMIN'])
  userType?: 'USER' | 'MERCHANT' | 'ADMIN';

  @IsOptional()
  @IsIn(['ACTIVE', 'DISABLED'])
  status?: 'ACTIVE' | 'DISABLED';
}

/** 更新 C 端用户 */
export class AdminConvUserUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @IsOptional()
  @IsIn(['USER', 'MERCHANT', 'ADMIN'])
  userType?: 'USER' | 'MERCHANT' | 'ADMIN';

  @IsOptional()
  @IsIn(['ACTIVE', 'DISABLED'])
  status?: 'ACTIVE' | 'DISABLED';
}

/** 重置 C 端用户密码 */
export class AdminConvUserResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  password!: string;
}

/** 分类创建（ID 需手动指定，与种子数据策略一致） */
export class AdminCategoryCreateDto {
  @Type(() => Number)
  @IsInt()
  id!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

/** 分类更新 */
export class AdminCategoryUpdateDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

/** 轮播图创建/更新 */
export class AdminBannerPayloadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  imageUrl!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  linkUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number;

  @IsOptional()
  @IsBoolean()
  online?: boolean;
}

/** 公告创建/更新 */
export class AdminNoticePayloadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

/** 举报列表查询 */
export class AdminReportQueryDto extends AdminPageQueryDto {
  @IsOptional()
  @IsIn(['SPAM', 'FRAUD', 'ILLEGAL', 'OTHER'])
  reportType?: 'SPAM' | 'FRAUD' | 'ILLEGAL' | 'OTHER';
}
