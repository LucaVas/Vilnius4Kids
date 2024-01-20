import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDistrictToAddresses1705757875370 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "addresses" ADD COLUMN district VARCHAR(255) NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN district`);
    }
}
