import { IsString, IsNotEmpty, IsArray, IsUrl, IsOptional, IsDateString, ValidateIf } from 'class-validator';

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

  @ValidateIf(o => o.website && o.website.toUpperCase() !== 'N/A' && o.website.toUpperCase() !== 'NONE')
  @IsUrl()
  @IsNotEmpty()
  website: string;

  @ValidateIf(o => o.docsUrl && o.docsUrl.toUpperCase() !== 'N/A' && o.docsUrl.toUpperCase() !== 'NONE' && o.docsUrl.trim() !== '')
  @IsUrl()
  @IsOptional()
  docsUrl?: string;

  @IsString()
  @IsOptional()
  xHandle?: string;

  @ValidateIf(o => o.githubUrl && o.githubUrl.toUpperCase() !== 'N/A' && o.githubUrl.toUpperCase() !== 'NONE')
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
