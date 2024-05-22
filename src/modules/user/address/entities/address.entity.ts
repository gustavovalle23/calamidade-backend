import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../entities/user.entity";

@Entity({ name: "user_address" })
export class UserAddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: true })
  street?: string | null;

  @Column({ type: "varchar", nullable: true })
  addressName?: string | null;

  @Column({ type: "varchar", nullable: true })
  complement?: string | null;

  @Column({ type: "varchar", nullable: true })
  number?: string | null;

  @Column({ type: "varchar", nullable: true })
  city?: string | null;

  @Column({ type: "varchar", nullable: true, length: 2 })
  uf?: string | null;

  @Column({ type: "varchar", nullable: true })
  cep?: string | null;

  @Column({ type: "varchar", nullable: true })
  locationLatitude?: string | null;

  @Column({ type: "varchar", nullable: true })
  locationLongitude?: string | null;

  @ManyToOne(() => User, user => user.addresses, { eager: false })
  user: User;
}
