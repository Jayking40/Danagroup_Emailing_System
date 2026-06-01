import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1780308419155 implements MigrationInterface {
  name = "AutoMigration1780308419155";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar_public_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "job_title" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "avatar_url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ba7ae7820d8342815027197b51" ON "message_recipients" ("message_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5acbac375fcefefa557317b9b3" ON "message_recipients" ("recipient_id", "is_read") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8aa2a5ea4c062fc912fe5569aa" ON "message_recipients" ("recipient_id", "is_deleted") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8aa2a5ea4c062fc912fe5569aa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5acbac375fcefefa557317b9b3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ba7ae7820d8342815027197b51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "avatar_url" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "job_title" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "avatar_public_id"`,
    );
  }
}
