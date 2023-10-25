import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubType } from './sub-types.entity';

@Entity('types')
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    nullable: false,
    unique: true,
  })
  name: string;

  @Column('varchar', {
    nullable: false,
  })
  description: string;

  @OneToMany(() => SubType, (subtypes) => subtypes.type, {
    onDelete: 'CASCADE',
  })
  subTypes: SubType[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
