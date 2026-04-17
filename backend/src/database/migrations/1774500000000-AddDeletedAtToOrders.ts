import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToOrders1774500000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "orders" ADD COLUMN "deleted_at" TIMESTAMP DEFAULT NULL`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_orders_deleted_at" ON "orders" ("deleted_at")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_orders_deleted_at"`);
        await queryRunner.query(
            `ALTER TABLE "orders" DROP COLUMN "deleted_at"`,
        );
    }
}
