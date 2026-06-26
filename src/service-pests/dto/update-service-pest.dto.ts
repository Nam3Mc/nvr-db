import { PartialType } from "@nestjs/swagger";
import { CreateServicePestDto } from "./create-service-pest.dto";

export class UpdateServicePestDto extends PartialType(CreateServicePestDto) {
    
}