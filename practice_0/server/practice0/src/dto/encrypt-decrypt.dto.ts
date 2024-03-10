import { IsNotEmpty, IsString } from "class-validator";

export class EncryptDecryptDto {
  @IsNotEmpty()
  @IsString()
  password!: string
}