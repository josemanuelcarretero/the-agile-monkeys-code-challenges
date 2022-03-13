import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserModel1646973690549 implements MigrationInterface {
  name = 'addUserModel1646973690549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity"
       (
           "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
           "name"       character varying NOT NULL,
           "surname"    character varying NOT NULL,
           "email"      character varying NOT NULL,
           "password"   character varying NOT NULL,
           "deleted"    boolean           NOT NULL DEFAULT false,
           "type"       character varying NOT NULL,
           "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
           "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
           "deleted_at" TIMESTAMP,
           CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"),
           CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id")
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
