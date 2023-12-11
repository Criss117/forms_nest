import { Form } from '../../../form/entities/form.entity';
import { SubQuestion } from '../../../questions/sub-question/entities/sub-question.entity';
import { SubType } from '../../../type/entities/sub-types.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('bool', {
    default: false,
  })
  required: boolean;

  @Column('varchar', {
    length: 255,
  })
  question: string;

  @ManyToOne(() => Form, (form) => form.questions, { onDelete: 'CASCADE' })
  form: Form;

  @ManyToOne(() => SubType, (subtype) => subtype.questions)
  subtype: SubType;

  @OneToMany(() => SubQuestion, (subQuestions) => subQuestions.question, {
    onDelete: 'CASCADE',
  })
  subQuestions: SubQuestion[];

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
