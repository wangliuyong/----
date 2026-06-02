import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsIn(['menu', 'button', 'api'])
  type!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['menu', 'button', 'api'])
  type?: string;

  @IsOptional()
  @IsInt()
  sort?: number;
}
