import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JobsService } from "./jobs.service";

@ApiTags("jobs")
@ApiBearerAuth()
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get("monitor")
  @ApiOperation({ summary: "Get queue health and job counts" })
  getQueueStats() {
    return this.jobsService.getQueueStats();
  }
}
