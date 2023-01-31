import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('sessions')
class Session {
    
    @PrimaryGeneratedColumn('uuid')
    sessionId!: string;

    @Column('varchar')
    conversationId!: string;

    @Column('varchar')
    messageId!: string;

}

export default Session