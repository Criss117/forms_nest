import { Answer } from 'src/questions/entities/answer.entity';
import { Form } from '../../form/entities/form.entity';
import { SubType } from '../../type/entities/sub-types.entity';
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bool', {
    default: false,
  })
  required: boolean;

  @Column('varchar', {
    length: 255,
  })
  question: string;

  @ManyToOne(() => Form, (form) => form.questions)
  form: Form;

  @ManyToOne(() => SubType, (subtype) => subtype.questions)
  subtype: SubType;

  @OneToMany(() => Answer, (answers) => answers.question)
  answers: Answer[];

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
}
