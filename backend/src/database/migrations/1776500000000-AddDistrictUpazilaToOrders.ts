import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDistrictUpazilaToOrders1776500000000
    implements MigrationInterface
{
    name = 'AddDistrictUpazilaToOrders1776500000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "district" VARCHAR(100) NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "upazila" VARCHAR(100) NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "upazila"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "district"`);
    }
}
