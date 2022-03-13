import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateCustomerModel1647206311244 implements MigrationInterface {
  name = 'updateCustomerModel1647206311244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "customer_entity" ADD "created_by" uuid
    `);
    await queryRunner.query(`
            ALTER TABLE "customer_entity" ADD "updated_by" uuid
    `);
    await queryRunner.query(`
            ALTER TABLE "customer_entity" ADD "deleted_by" uuid
    `);
    await queryRunner.query(`
        ALTER TABLE "customer_entity" ADD CONSTRAINT "FK_597047eb7a0199d36026a96c44b" FOREIGN KEY ("created_by") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "customer_entity" ADD CONSTRAINT "FK_5e5df2e12b113ede1b829c61df7" FOREIGN KEY ("updated_by") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "customer_entity" ADD CONSTRAINT "FK_56243f6a822fa6f65601b5152b7" FOREIGN KEY ("deleted_by") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_entity" DROP CONSTRAINT "FK_56243f6a822fa6f65601b5152b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_entity" DROP CONSTRAINT "FK_5e5df2e12b113ede1b829c61df7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_entity" DROP CONSTRAINT "FK_597047eb7a0199d36026a96c44b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_entity" DROP COLUMN "deleted_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_entity" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_entity" DROP COLUMN "created_by"`,
    );
  }
}
