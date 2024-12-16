import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { Role } from "./role.entity"

@Entity()
export class User extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    fullName: string;

    @Column({ type: 'text', unique: true, nullable: false })
    email: string;

    @Column({ type: 'text', nullable: false })
    password: string

    @ManyToMany(() => Role, { cascade: true })
    @JoinTable()
    roles: Role[];
}
