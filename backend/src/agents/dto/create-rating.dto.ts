import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @IsString()
  @IsNotEmpty()
  usageProofTx: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
