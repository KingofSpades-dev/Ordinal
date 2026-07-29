import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateDossierDto {
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  verdict: string;

  @IsString()
  @IsNotEmpty()
  methodologyVersion: string;
}

export class AwardKeyDto {
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsInt()
  @Min(0)
  @Max(3)
  keyCount: number;

  @IsInt()
  @Min(1)
  expiresInDays: number;

  @IsString()
  @IsNotEmpty()
  rationale: string;
}

export class RevokeKeyDto {
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
