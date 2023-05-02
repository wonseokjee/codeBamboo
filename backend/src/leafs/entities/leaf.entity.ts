import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Timestamp,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { Code } from './code.entity';
import { Bookmark } from 'src/users/entities/bookmark.entity';
import { LikeEntity } from 'src/users/entities/like.entity';

@Entity()
export class Leaf {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  leaf_id: number;

  @Column({ type: 'boolean' })
  is_root: boolean;

  @Column()
  type: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @CreateDateColumn()
  creation_time: Timestamp;

  @Column({ default: 0 })
  export: number;

  @Column({ default: 0, nullable: true })
  step: number;

  @Column({ default: 0, nullable: true })
  ref_order: number;

  @Column({ type: 'bigint', default: 0 })
  parent_leaf_id: number;

  @ManyToOne(() => User, (user) => user.leafs, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Topic, (topic) => topic.leafs, { eager: true })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @OneToMany(() => Code, (code) => code.leaf, { eager: true })
  code: Code[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];
}
