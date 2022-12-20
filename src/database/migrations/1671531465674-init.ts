import { MigrationInterface, QueryRunner } from "typeorm";

export class init1671531465674 implements MigrationInterface {
    name = 'init1671531465674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "image" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scenes" ("id" character varying NOT NULL, "location" character varying NOT NULL, "distance" integer NOT NULL, "replies" jsonb NOT NULL, "buttons" jsonb, "nextScene" jsonb, CONSTRAINT "PK_071fd0f410cbb449feebafd46ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sceneId" character varying, CONSTRAINT "REL_d7d163c218456131feea83acec" UNIQUE ("sceneId"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("userId" integer NOT NULL, "first_name" character varying NOT NULL, "username" character varying NOT NULL, "name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "gameId" uuid, CONSTRAINT "REL_ef2c08ee8d674c2de4ae5ca124" UNIQUE ("gameId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LatestSceneIds" ("latestScenesId" uuid NOT NULL, "gameId" character varying NOT NULL, CONSTRAINT "PK_28fc855042866782c1d4c741c38" PRIMARY KEY ("latestScenesId", "gameId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d271196f4eb8432e7cb46a014c" ON "LatestSceneIds" ("latestScenesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7339684ecbfdcf7232b987b55a" ON "LatestSceneIds" ("gameId") `);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_d7d163c218456131feea83aceca" FOREIGN KEY ("sceneId") REFERENCES "scenes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_ef2c08ee8d674c2de4ae5ca1243" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LatestSceneIds" ADD CONSTRAINT "FK_d271196f4eb8432e7cb46a014c2" FOREIGN KEY ("latestScenesId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "LatestSceneIds" ADD CONSTRAINT "FK_7339684ecbfdcf7232b987b55ad" FOREIGN KEY ("gameId") REFERENCES "scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LatestSceneIds" DROP CONSTRAINT "FK_7339684ecbfdcf7232b987b55ad"`);
        await queryRunner.query(`ALTER TABLE "LatestSceneIds" DROP CONSTRAINT "FK_d271196f4eb8432e7cb46a014c2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_ef2c08ee8d674c2de4ae5ca1243"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_d7d163c218456131feea83aceca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7339684ecbfdcf7232b987b55a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d271196f4eb8432e7cb46a014c"`);
        await queryRunner.query(`DROP TABLE "LatestSceneIds"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "scenes"`);
        await queryRunner.query(`DROP TABLE "article"`);
    }

}
