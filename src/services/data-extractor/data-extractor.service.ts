import { Injectable, Logger } from "@nestjs/common";
import { WorkloadDto } from "../../model/workload.dto";

@Injectable()
export class DataExtractorService {

  private readonly logger = new Logger(DataExtractorService.name);


  extractWorkload(data: string): WorkloadDto {
    let substring = "";
    try {
      const workloadData = data.substring(data.indexOf("workload"));
      substring = workloadData.substring(
        workloadData.indexOf("{"),
        workloadData.indexOf("}") + 1
      );
      substring = substring.replace(/\\/g, "");
      return JSON.parse(substring);
    } catch (e) {
      this.logger.error("Could not parse Workload to correct format");
      this.logger.error(`Substring: ${substring}`);
    }
  }

  extractStudioAlias(data: string) {
    return DataExtractorService.extractStringProperty(data, "alias");
  }

  private static extractStringProperty(data: string, property: string) {
    const workloadData = data.substring(data.indexOf(property) + property.length + 1);
    return workloadData.substring(
      workloadData.indexOf("\"") + 1,
      workloadData.indexOf(",") - 1
    )
  }

}


