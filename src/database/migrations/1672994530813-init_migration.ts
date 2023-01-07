import { MigrationInterface, QueryRunner } from "typeorm";

export class initMigration1672994530813 implements MigrationInterface {
    name = 'initMigration1672994530813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("username" character varying, "publicname" character varying, "email" character varying, "password" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "confirmed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "telegramId" integer, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_6758e6c1db84e6f7e711f8021f" UNIQUE ("telegramId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "telegram" ("id" integer NOT NULL, "first_name" character varying NOT NULL, "username" character varying NOT NULL, "session" jsonb NOT NULL, CONSTRAINT "UQ_82a8575f72bca0c237d3dbad106" UNIQUE ("username"), CONSTRAINT "PK_2db8c5fd44d5a77259aadc814b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "story" ("id" character varying NOT NULL, "replies" jsonb NOT NULL, "buttons" jsonb, "nextScene" jsonb, CONSTRAINT "PK_28fce6873d61e2cace70a0f3361" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("storyId" character varying NOT NULL, "saveSlots" character varying array NOT NULL DEFAULT '{}', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "REL_60aa4ec0e63a8e0de9e45cc3f0" UNIQUE ("storyId"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6758e6c1db84e6f7e711f8021f5" FOREIGN KEY ("telegramId") REFERENCES "telegram"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_60aa4ec0e63a8e0de9e45cc3f00" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_60aa4ec0e63a8e0de9e45cc3f00"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6758e6c1db84e6f7e711f8021f5"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "story"`);
        await queryRunner.query(`DROP TABLE "telegram"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
