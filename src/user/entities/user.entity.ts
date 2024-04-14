import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserLevel } from 'src/common/utils/enums';
import { UserFolder } from 'src/folder/user-folder/entities/user-folder.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 50,
  })
  name: string;

  @Column('varchar', {
    length: 50,
  })
  surname: string;

  @Column('varchar', {
    length: 20,
  })
  phone: string;

  @Column('varchar', {
    length: 320,
    unique: true,
  })
  email: string;

  @Column('varchar', {
    length: 60,
  })
  password: string;

  @Column('varchar', {
    length: 100,
  })
  token?: string;

  @Column('tinyint', {
    width: 1,
    default: 0,
  })
  confirm: boolean;

  @Column('enum', {
    enum: UserLevel,
    default: UserLevel.LEVEL1,
  })
  level: UserLevel;

  @Column('timestamp', {
    name: 'token_expiration',
    nullable: true,
  })
  tokenExpiration?: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @OneToMany(() => UserFolder, (userFolder) => userFolder.user, {
    onDelete: 'CASCADE',
  })
  userFolder: UserFolder[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBefore() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeInsert()
  tokenExpirationDate() {
    this.tokenExpiration = new Date();
  }

  @Column('tinyint', {
    width: 1,
    default: 1,
  })
  active: boolean;
}
