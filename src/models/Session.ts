import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('sessions')
class Session {

    @PrimaryGeneratedColumn('uuid')
    session_id!: string;

    @Column('varchar')
    phone!: string

    @Column('varchar')
    conversation_id!: string;

    @Column('varchar')
    message_id!: string;

    @Column('varchar')
    selected_session!: string

}

export default Session
