import { SqliteAdapter } from './sqlite.js';
import { PostgresqlAdapter } from './postgresql.js';
import { Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { SqlAdapter } from './d.js';

@Provide()
@Scope(ScopeEnum.Singleton)
export class DbAdapter implements SqlAdapter {
  adapter: SqlAdapter;
  @Config('typeorm.dataSource.default.type')
  dbType: string;

  @Init()
  async init() {
    if (this.isSqlite()) {
      this.adapter = new SqliteAdapter();
    } else if (this.isPostgresql()) {
      this.adapter = new PostgresqlAdapter();
    } else {
      throw new Error(`dbType ${this.dbType} not support`);
    }
  }

  isSqlite() {
    return this.dbType === 'better-sqlite3';
  }
  isPostgresql() {
    return this.dbType === 'postgres';
  }

  date(columnName: string) {
    return this.adapter.date(columnName);
  }
}
