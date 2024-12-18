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
  "user_id"     integer,
  "product_id"  integer,
  "title"       varchar(100),
  "count"       integer,
  "price"       integer,
  "amount"      integer,
  "remark"      varchar(100),
  "status"      varchar(100),
  "pay_id"      integer,
  "pay_time"    integer,
  "pay_type"    varchar(100),
  "pay_no"      varchar(100),
  "create_time" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "update_time" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);



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



