import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HealthIndicatorService } from "@nestjs/terminus";
import Redis from "ioredis";

@Injectable()
export class RedisHealthIndicator {
  // ✅ Correct: Define the type, don't assign the class itself
  private client: Redis;

  constructor(
    private healthIndicatorService: HealthIndicatorService,
    private configService: ConfigService,
  ) {
    const redisPassword = this.configService.get<string>("REDIS_PASSWORD", "");
    const redisUrl =
      this.configService.get<string>("REDIS_URL") ||
      (redisPassword
        ? `redis://:${redisPassword}@${this.configService.get("REDIS_HOST", "localhost")}:${this.configService.get("REDIS_PORT", "6379")}`
        : `redis://${this.configService.get("REDIS_HOST", "localhost")}:${this.configService.get("REDIS_PORT", "6379")}`);
    // ✅ This now correctly assigns the instance to the client property
    this.client = new Redis(redisUrl);
  }

  async isHealthy(key: string) {
    // Use the service to create the indicator
    const indicator = this.healthIndicatorService.check(key);

    try {
      const res = await this.client.ping();
      if (res === "PONG") {
        return indicator.up(); // Returns { [key]: { status: 'up' } }
      }
      return indicator.down();
    } catch (error) {
      return indicator.down({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
