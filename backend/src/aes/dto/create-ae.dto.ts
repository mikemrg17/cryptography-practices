import { IsNotEmpty, IsString } from "class-validator";

export class CreateAeDto {
  @IsNotEmpty()
  @IsString()
  password!: string
}
