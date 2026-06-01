import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nickname!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  contact?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content!: string;
}
