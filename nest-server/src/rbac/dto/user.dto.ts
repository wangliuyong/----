import { IsArray, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminUserDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsInt()
  status?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  roleIds?: number[];
}

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsInt()
  status?: number;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

export class AssignUserRolesDto {
  @IsArray()
  @IsInt({ each: true })
  roleIds!: number[];
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  password!: string;
}
