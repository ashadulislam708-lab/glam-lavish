import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWcStockQuantity1776600000000 implements MigrationInterface {
    name = 'AddWcStockQuantity1776600000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "products" ADD COLUMN "wc_stock_quantity" integer DEFAULT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "product_variations" ADD COLUMN "wc_stock_quantity" integer DEFAULT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_variations" DROP COLUMN "wc_stock_quantity"`,
        );
        await queryRunner.query(
            `ALTER TABLE "products" DROP COLUMN "wc_stock_quantity"`,
        );
    }
}
