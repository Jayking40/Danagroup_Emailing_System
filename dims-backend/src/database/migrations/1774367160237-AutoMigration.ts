import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1774367160237 implements MigrationInterface {
    name = 'AutoMigration1774367160237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add the missing sessions column to users
        await queryRunner.query(`ALTER TABLE "users" ADD "sessions" json`);

        // 2. Fix the Department Unique Constraint
        // First, drop the accidental unique constraint on subsidiary_id if it exists
        // (TypeORM might have failed before this, so we use a try/catch or check)
        await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT IF EXISTS "UQ_62c11dc60cf31d3f558fae5728d"`);
        
        // 3. Create the correct composite unique index (Name + Subsidiary)
        await queryRunner.query(`ALTER TABLE "departments" ADD CONSTRAINT "UQ_DEPT_NAME_SUBSIDIARY" UNIQUE ("name", "subsidiary_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse the changes
        await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT "UQ_DEPT_NAME_SUBSIDIARY"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "sessions"`);
        
        // Re-add the old constraint if you need to roll back to the exact previous state
        await queryRunner.query(`ALTER TABLE "departments" ADD CONSTRAINT "UQ_62c11dc60cf31d3f558fae5728d" UNIQUE ("subsidiary_id")`);
    }
}
