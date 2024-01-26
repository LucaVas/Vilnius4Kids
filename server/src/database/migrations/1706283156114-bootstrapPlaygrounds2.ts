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

export class BootstrapPlaygrounds21706283156114 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const { playgrounds }: JsonPlayground = JSON.parse(
            fs.readFileSync(
                relative('./migrations/bootstrap/playgrounds_2.json'),
                'utf8'
            )
        );

        if (playgrounds.length > 0) {
            playgrounds.map(async (p) => {
                const [{ id }] = await queryRunner.query(
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
                    `INSERT INTO "playgrounds" (is_open, is_private, address_id, latitude, longitude) VALUES ($1, $2, $3, $4, $5)`,
                    [true, false, id, p.latitude, p.longitude]
                );
            });
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "addresses" WHERE id > 5`);
        await queryRunner.query(`DELETE FROM "playgrounds WHERE id > 5"`);
        await queryRunner.query(
            `ALTER SEQUENCE addresses_id_seq RESTART WITH 6`
        );
        await queryRunner.query(
            `ALTER SEQUENCE playgrounds_id_seq RESTART WITH 6`
        );
    }
}
