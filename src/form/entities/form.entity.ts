import { Question } from 'src/questions/entities/question.entity';
import { Folder } from '../../folder/entities/folder.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('forms')
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 30,
  })
  name: string;

  @Column('varchar', {
    length: 255,
  })
  description: string;

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

  @ManyToOne(() => Folder, (folder) => folder.forms, {
    nullable: false,
  })
  folder: Folder;

  @OneToMany(() => Question, (questions) => questions.form)
  questions: Question[];

  @Column('tinyint', {
    width: 1,
    default: 1,
  })
  active: boolean;
}
