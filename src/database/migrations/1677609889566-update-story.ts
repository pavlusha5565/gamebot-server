import { MigrationInterface, QueryRunner } from "typeorm";

export class updateStory1677609889566 implements MigrationInterface {
    name = 'updateStory1677609889566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "story" ADD "start_event_id" uuid`);
        await queryRunner.query(`ALTER TABLE "story" ADD CONSTRAINT "UQ_beae73984c6e8c0e9e894a62da6" UNIQUE ("start_event_id")`);
        await queryRunner.query(`ALTER TABLE "story" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "story" ALTER COLUMN "playtime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "story" ADD CONSTRAINT "FK_beae73984c6e8c0e9e894a62da6" FOREIGN KEY ("start_event_id") REFERENCES "story_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "story" DROP CONSTRAINT "FK_beae73984c6e8c0e9e894a62da6"`);
        await queryRunner.query(`ALTER TABLE "story" ALTER COLUMN "playtime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "story" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "story" DROP CONSTRAINT "UQ_beae73984c6e8c0e9e894a62da6"`);
        await queryRunner.query(`ALTER TABLE "story" DROP COLUMN "start_event_id"`);
    }

}
