import { MigrationInterface, QueryRunner } from "typeorm";

export class session1677607000584 implements MigrationInterface {
    name = 'session1677607000584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "id" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

}
