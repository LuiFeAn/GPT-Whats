import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('sessions')
class Session {

    @PrimaryGeneratedColumn('uuid')
    session_id!: string;

    @Column('varchar')
    conversation_id!: string;

    @Column('varchar')
    message_id!: string;

}

export default Session
