import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  status?: number;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  status?: number;
}

export class AssignRolePermissionsDto {
  @IsArray()
  @IsInt({ each: true })
  permissionIds!: number[];
}
