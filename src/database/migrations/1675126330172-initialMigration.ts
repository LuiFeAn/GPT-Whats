import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class initialMigration1675126330172 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        queryRunner.createTable( new Table({

            name:'sessions',
            columns:[

                {
                    name:'session_id',
                    type:'uuid',
                    generationStrategy:'uuid',
                    isPrimary:true,
                    default:'uuid_generate_v4()'

                },
                {
                    name:'conversation_id',
                    type:'uuid',
                },
                {
                    name:'message_id',
                    type:'uuid'
                }

            ]

        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropTable('sessions');

    }

}
