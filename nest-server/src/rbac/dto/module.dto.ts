import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateModuleDto {
  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsIn(['menu'])
  type!: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @IsOptional()
  @IsInt()
  status?: number;
}

export class UpdateModuleDto {
  @IsOptional()
  @IsInt()
  parentId?: number | null;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['menu'])
  type?: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  sort?: number;

  @IsOptional()
  @IsInt()
  status?: number;
}
