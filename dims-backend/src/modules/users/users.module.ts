import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { MailModule } from "@modules/mail/mail.module";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { UsersSearchService } from "./users-search.service";

@Module({
  imports: [
    MailModule,
    // ElasticsearchModule.register({...}),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersSearchService],
  exports: [UsersService],
})
export class UsersModule {}
