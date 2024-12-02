import { Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 */
// @Entity('cd_site_info')
export class SiteInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'user_id', comment: '用户id' })
  userId: number;
  @Column({ comment: '站点名称', length: 100 })
  name: string;
  @Column({ comment: '域名', length: 100 })
  domain: string;
  @Column({ name: 'cert_info', comment: '证书详情', length: 1000 })
  certInfo: string;
  @Column({ name: 'cert_status', comment: '证书状态', length: 100 })
  certStatus: string;
  @Column({ name: 'cert_valid_to', comment: '证书到期时间', length: 100 })
  certValidTo: Date;
  @Column({ name: 'last_time', comment: '上次检查时间' })
  lastTime: Date;
  @Column({ name: 'pipeline_id', comment: '关联流水线id' })
  pipelineId: number;
  @Column({ name: 'create_time', comment: '创建时间', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;
  @Column({ name: 'update_time', comment: '修改时间', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;
}
