import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Type } from './type.entity';
import { Question } from '../../questions/question/entities/question.entity';

@Entity('sub_types')
export class SubType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    nullable: false,
  })
  name: string;

  @Column('varchar', {
    nullable: false,
  })
  description: string;

  @ManyToOne(() => Type, (type) => type.subTypes, { onDelete: 'CASCADE' })
  type: Type;

  @OneToMany(() => Question, (question) => question.subtype)
  questions: Question[];

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
