import fs from 'fs';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { relative } from '..';

type JsonPlayground = {
    playgrounds: [
        {
            address: {
                street: string;
                number: string;
                city: string;
                zipCode: string;
                district: string;
            };
            latitude: number;
            longitude: number;
        },
    ];
};

export class BoostratpPlaygrounds1705755908980 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const { playgrounds }: JsonPlayground = JSON.parse(
            fs.readFileSync(
                relative('./migrations/bootstrap/playgrounds.json'),
                'utf8'
            )
        );

        if (playgrounds.length > 0) {
            playgrounds.map(async (p) => {
                const [ { id } ] = await queryRunner.query(
                    `INSERT INTO "addresses" (street, number, city, zip_code, district) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                    [
                        p.address.street,
                        p.address.number,
                        p.address.city,
                        parseInt(p.address.zipCode, 10),
                        p.address.district,
                    ]
                );

                await queryRunner.query(
                    `INSERT INTO "playgrounds" (is_open, is_private, address_id) VALUES ($1, $2, $3)`,
                    [true, false, id]
                );
            });
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "addresses"`);
        await queryRunner.query(`DELETE FROM "playgrounds"`);
        await queryRunner.query(
            `ALTER SEQUENCE addresses_id_seq RESTART WITH 1`
        );
        await queryRunner.query(
            `ALTER SEQUENCE playgrounds_id_seq RESTART WITH 1`
        );
    }
}
