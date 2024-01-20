import { MigrationInterface, QueryRunner } from "typeorm"

export class AddLatitudeAndLongitudeToPlaygrounds1705787457542 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "playgrounds" ADD COLUMN latitude NUMERIC(9,6) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "playgrounds" ADD COLUMN longitude NUMERIC(9,6) NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "playgrounds" DROP COLUMN latitude`
        );
        await queryRunner.query(
            `ALTER TABLE "playgrounds" DROP COLUMN longitude`
        );
    }

}
