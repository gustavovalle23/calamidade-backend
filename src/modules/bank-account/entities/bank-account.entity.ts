import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EntityHelper } from "../../../utils/entity-helper";
import { User } from "../../user/entities/user.entity";


@Entity({name: 'user_bank'})
export class BankAccountEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  bankName: string;

  @Column({ type: 'varchar', nullable: true })
  agency: string | null;

  @Column({ type: 'varchar', nullable: true })
  account: string | null;

  @Column({ type: 'varchar', nullable: true })
  digit: string | null;

  @Column({ type: 'varchar', nullable: true })
  keyPix: string | null;

  @Column({ type: 'varchar' })
  document: string;

  @ManyToOne(() => User, { eager: false })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

