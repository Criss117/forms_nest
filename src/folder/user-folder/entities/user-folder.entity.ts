import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { UserPermissions } from 'src/common/utils/enums';

@Entity('user_folder')
export class UserFolder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userFolder, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.userFolder, {
    onDelete: 'CASCADE',
  })
  folder: Folder;

  @Column({ type: 'enum', enum: UserPermissions })
  permissions: UserPermissions;

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
}
