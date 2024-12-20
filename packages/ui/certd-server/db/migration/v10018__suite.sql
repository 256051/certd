CREATE TABLE "cd_product"
(
  "id"              integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "icon"            varchar(100),
  "title"           varchar(100),
  "type"            varchar(100),
  "content"         varchar(4096),
  "duration_prices" varchar(10240),
  "duration"        integer,
  "price"           integer,
  "intro"           varchar(10240),
  "order"           integer,
  "is_bootstrap"    boolean,
  "disabled"        boolean  NOT NULL DEFAULT (false),
  "create_time"     datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "update_time"     datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);



CREATE TABLE "cd_payment"
(
  "id"          integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "type"        varchar(100),
  "title"       varchar(100),
  "setting"     text,
  "order"       integer,
  "disabled"    boolean  NOT NULL DEFAULT (false),
  "create_time" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "update_time" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);


CREATE TABLE "cd_trade"
(
  "id"          integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "trade_no"    varchar(100),
  "user_id"     integer,
  "product_id"  integer,
  "title"       varchar(1024),
  "desc"        varchar(2048),
  "num"         integer,
  "duration"    integer,
  "price"       integer,
  "amount"      integer,
  "remark"      varchar(2048),
  "status"      varchar(100),
  "pay_type"    varchar(50),
  "pay_time"    integer,
  "pay_no"      varchar(100),
  "end_time"    integer,
  "create_time" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "update_time" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX "index_trade_user_id" ON "cd_trade" ("user_id");
CREATE UNIQUE INDEX "index_trade_trade_no" ON "cd_trade" ("trade_no");
CREATE INDEX "index_trade_pay_no" ON "cd_trade" ("pay_type","pay_no");


CREATE TABLE "cd_user_suite"
(
  "id"                integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id"           integer,
  "product_id"        integer,
  "trade_id"          integer,
  "icon"              varchar(100),
  "title"             varchar(100),
  "content"           text,
  "duration"          integer,
  "used_deploy_count" integer,
  "active_time"       integer,
  "expires_time"      integer,
  "create_time"       datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "update_time"       datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX "index_user_suite_user_id" ON "cd_user_suite" ("user_id");


DROP TABLE IF EXISTS "cd_cert";
DROP TABLE IF EXISTS "cd_cert_apply_history";
DROP TABLE IF EXISTS "cd_cert_issuer";
DROP TABLE IF EXISTS "cd_task";
DROP TABLE IF EXISTS "cd_task_history";

