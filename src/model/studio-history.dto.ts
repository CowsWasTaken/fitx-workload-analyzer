import { WorkloadDto } from "./workload.dto";

export class StudioHistoryDto {
  id: number;
  name: string;
  workloadRecords: WorkloadDto[]
}
