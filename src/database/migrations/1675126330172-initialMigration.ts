import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class initialMigration1675126330172 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable( new Table({

            name:'sessions',
            columns:[

                {
                    name:'session_id',
                    type:'uuid',
                    isPrimary:true,

                },
                {
                    name:'session_name',
                    type:'varchar',
                },
                {
                    name:'phone',
                    type:'varchar',
                    length:'50'
                },
                {
                    name:'conversation_id',
                    type:'uuid',
                },
                {
                    name:'message_id',
                    type:'varchar'
                },
                {
                    name:'selected_session',
                    type:'varchar',
                    length:'3'
                }

            ]

        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropTable('sessions');

    }

}
