import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ContactConfigDto, NavItemDto, ProfileDto } from '../../site/site.types';

class NavItemInput implements NavItemDto {
  @IsString()
  @IsNotEmpty()
  href!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;
}

/** 更新站点配置（管理端） */
export class UpdateSiteConfigDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  siteName?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemInput)
  nav?: NavItemDto[];

  @IsOptional()
  about?: ProfileDto;

  @IsOptional()
  contact?: ContactConfigDto;
}
