import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1677380856499 implements MigrationInterface {
  name = 'init1677380856499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("username" character varying, "email" character varying, "password" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "confirmed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "story" ("name" character varying NOT NULL, "description" character varying NOT NULL, "playtime" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_28fce6873d61e2cace70a0f3361" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "story_event" ("name" character varying NOT NULL, "replies" jsonb NOT NULL, "asnwers" jsonb, "nextScene" jsonb, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "storyId" uuid, CONSTRAINT "PK_17a0909c6f6ee9c3ef8c717629a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game" ("user_id" uuid NOT NULL, "story_id" uuid NOT NULL, "event_id" uuid NOT NULL, "attributes" jsonb NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "saves" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "story" ADD CONSTRAINT "FK_deb112632d0b5be276f59287d99" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_event" ADD CONSTRAINT "FK_fbe00687304aeb345fb9d26c791" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_0744ead8ea37cf3325c971f5f18" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_dbcc5ff8c4dd0e444305ffcca39" FOREIGN KEY ("story_id") REFERENCES "story"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_d979b8a4d47b02b8f87322f33e0" FOREIGN KEY ("event_id") REFERENCES "story_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_d979b8a4d47b02b8f87322f33e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_dbcc5ff8c4dd0e444305ffcca39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_0744ead8ea37cf3325c971f5f18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_event" DROP CONSTRAINT "FK_fbe00687304aeb345fb9d26c791"`,
    );
    await queryRunner.query(
      `ALTER TABLE "story" DROP CONSTRAINT "FK_deb112632d0b5be276f59287d99"`,
    );
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`DROP TABLE "story_event"`);
    await queryRunner.query(`DROP TABLE "story"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
