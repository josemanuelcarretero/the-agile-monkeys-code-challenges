import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { UserType } from '../../user/enums/user-type.enum';

export class addInitialUsers1647207151490 implements MigrationInterface {
  name = 'addInitialUsers1647207151490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<UserEntity>(UserEntity, {
        name: 'admin',
        surname: 'admin',
        email: 'admin@crm.josemanuelcarretero.me',
        password:
          '$2b$10$80JYXzwd3AJNWM14R7sT9e3rqOId628y6juvV4lr88ngbrIcSSZWK',
        type: UserType.ADMIN,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.delete<UserEntity>(UserEntity, {
      email: 'admin@crm.josemanuelcarretero.me',
    });
  }
}
