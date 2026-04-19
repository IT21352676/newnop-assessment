import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Issue } from './issue.object';


@Entity()
export class User {
  @PrimaryColumn( { type: 'varchar',length: 100 })
  userId: string;

  @Column({ type: 'varchar',length: 100 })
  accessKey: string;

  @OneToMany(() => Issue, (issue) => issue.author)
  issues?: Issue[];

}
