import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedSubsidiariesAndDepartments1773825532081 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.startTransaction();

        try {
            // Insert subsidiaries safely (avoid duplicates)
            await queryRunner.query(`
                INSERT INTO "subsidiaries" (name, domain, created_at, updated_at)
                VALUES 
                    ('Dana Group HQ', 'danagroup.com', now(), now()),
                    ('Dana Pharma', 'danapharma.com', now(), now()),
                    ('Dana Plast', 'danaplast.com', now(), now()),
                    ('Dana Motors', 'danamotors.com', now(), now())
                ON CONFLICT (domain) DO NOTHING;
            `);

            // Insert departments safely using JOIN (more stable than UNION)
            await queryRunner.query(`
                INSERT INTO "departments" (name, subsidiary_id, created_at, updated_at)
                SELECT d.name, s.id, now(), now()
                FROM (
                    VALUES
                        ('Human Resources', 'danagroup.com'),
                        ('Finance', 'danagroup.com'),
                        ('IT', 'danagroup.com'),
                        ('Legal', 'danagroup.com'),
                        ('Sales & Marketing', 'danagroup.com'),
                        ('Operations', 'danaplast.com'),
                        ('Engineering & Technical', 'danaplast.com')
                ) AS d(name, domain)
                JOIN subsidiaries s ON s.domain = d.domain
                ON CONFLICT DO NOTHING;
            `);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`
                DELETE FROM "departments"
                WHERE name IN (
                    'Human Resources',
                    'Finance',
                    'Operations',
                    'IT',
                    'Legal',
                    'Sales & Marketing',
                    'Engineering & Technical'
                );
            `);

            await queryRunner.query(`
                DELETE FROM "subsidiaries"
                WHERE domain IN (
                    'danagroup.com',
                    'danapharma.com',
                    'danaplast.com',
                    'danamotors.com'
                );
            `);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
    }
}