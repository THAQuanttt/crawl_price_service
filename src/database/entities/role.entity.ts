import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { User } from "./user.entity"

@Entity()
export class Role extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    roleName: string;

    @ManyToMany(() => User, user => user.roles)
    user: User[];
}
