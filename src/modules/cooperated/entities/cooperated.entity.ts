import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Expose } from "class-transformer";
import { EntityHelper } from "src/utils/entity-helper";
import { OrganizationEntity } from "src/modules/organization/entities/organization.entity";
import { User } from "src/modules/user/entities/user.entity";

@Entity({ name: "cooperated" })
export class CooperatedEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: String, nullable: true })
  @Expose({ groups: ["me", "admin"] })
  email: string | null;

  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({ type: String, nullable: true })
  phone: string | null;

  @Index({ unique: true })
  @Column({ type: String, nullable: true })
  document: string | null;

  @ManyToOne(() => OrganizationEntity, { eager: false })
  organization?: OrganizationEntity | null;

  @OneToOne(() => User, user => user.cooperated)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
