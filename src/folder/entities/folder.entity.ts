import { Form } from '../../form/entities/form.entity';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { UserFolder } from '../user-folder/entities/user-folder.entity';

@Entity('folders')
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 30,
  })
  name: string;

  @OneToMany(() => Form, (forms) => forms.folder, {
    onDelete: 'CASCADE',
  })
  forms: Form[];

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

  @Column('tinyint', {
    width: 1,
    default: 1,
  })
  active: boolean;

  @OneToMany(() => UserFolder, (userFolder) => userFolder.folder, {
    onDelete: 'CASCADE',
  })
  userFolder: UserFolder[];
}
