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
import { Folder } from '../../folder/entities/folder.entity';

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

  @Column('int', {
    default: 5,
  })
  folder_limit?: number;

  @Column('int', {
    default: 5,
  })
  form_limit?: number;

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

  @OneToMany(() => Folder, (folder) => folder.user)
  folder: Folder[];

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
