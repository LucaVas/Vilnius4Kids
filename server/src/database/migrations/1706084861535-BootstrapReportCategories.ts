import fs from 'fs';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { relative } from '..';

type JsonCategories = {
    categories: [
        {
            topic: string;
            subCategories: [
                {
                    name: string;
                    description: string;
                },
            ];
        },
    ];
};

export class BootstrapReportCategories1706084861535
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        const { categories }: JsonCategories = JSON.parse(
            fs.readFileSync(
                relative('./migrations/bootstrap/report_categories.json'),
                'utf8'
            )
        );

        if (categories.length > 0) {
            categories.map(async (c) => {
                c.subCategories.map(async (sc) => {
                    await queryRunner.query(
                        `INSERT INTO "report_categories" (topic, name, description) VALUES ($1, $2, $3)`,
                        [c.topic, sc.name, sc.description]
                    );
                });
            });
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "report_categories"`);
        await queryRunner.query(
            `ALTER SEQUENCE report_categories_id_seq RESTART WITH 1`
        );
    }
}
