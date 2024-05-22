import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EntityHelper } from "../../../utils/entity-helper";
import { User } from "../../user/entities/user.entity";


@Entity({name: 'user_bank'})
export class BankAccountEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: false })
  @Column({ type: String })
  bankName: string;

  @Column({ type: String, nullable: true })
  agency: string | null;

  @Column({ type: String, nullable: true })
  account: string | null;

  @Column({ type: String, nullable: true })
  digit: string | null;

  @Column({ type: String, nullable: true })
  keyPix: string | null;

  @ManyToOne(() => User, { eager: false })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

