import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSaltFieldToUsers1587582938239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'salt',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('users', 'avatar');
  }
}
