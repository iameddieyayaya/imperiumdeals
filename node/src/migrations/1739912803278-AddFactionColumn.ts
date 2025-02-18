import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFactionColumn1739912803278 implements MigrationInterface {
    name = 'AddFactionColumn1739912803278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "faction" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "faction"`);
    }

}

//npx ts-node ./node_modules/typeorm/cli.js migration:generate src/migrations/AddFactionColumn -d src/data-source.ts
