import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cd_open_key')
export class OpenKeyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', comment: '用户id' })
  userId: number;

  @Column({ name: 'key_id', comment: 'keyId' })
  keyId: string;

  @Column({ name: 'key_secret', comment: 'keySecret' })
  keySecret: string;

  @Column({ name: 'create_time', comment: '创建时间', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ name: 'update_time', comment: '修改时间', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;
}
