import { IsString, IsNotEmpty, IsArray, IsUrl, IsOptional, IsDateString } from 'class-validator';

export class SubmitAgentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsString({ each: true })
  contractAddresses: string[];

  @IsArray()
  @IsString({ each: true })
  chains: string[];

  @IsUrl()
  @IsNotEmpty()
  website: string;

  @IsUrl()
  @IsNotEmpty()
  docsUrl: string;

  @IsString()
  @IsOptional()
  xHandle?: string;

  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @IsDateString()
  @IsNotEmpty()
  launchDate: string;

  @IsString()
  @IsNotEmpty()
  submitterWallet: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
