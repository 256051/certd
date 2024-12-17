CREATE TABLE "cd_product"
(
  "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "icon"                varchar(100),
  "title"               varchar(100),
  "type"                varchar(100),
  "max_domain_count"    integer,
  "max_pipeline_count"  integer,
  "max_deploy_count"    integer,
  "deploy_count_period" varchar(100),
  "site_monitor"        boolean,
  "expires_time"        integer,
  "price"               integer,
  "origin_price"        integer,
  "intro"               varchar(2048),
  "order"               integer,
  "disabled"            boolean  NOT NULL DEFAULT (false),
  "create_time"         datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "update_time"         datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);



CREATE TABLE "cd_payment"
(
  "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "type"                varchar(100),
  "title"               varchar(100),
  "setting"             text,
  "order"               integer,
  "disabled"            boolean  NOT NULL DEFAULT (false),
  "create_time"         datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "update_time"         datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);


CREATE TABLE "cd_order"
(
  "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id"             integer,
  "product_id"          integer,
  "title"               varchar(100),
  "count"               integer,
  "price"               integer,
  "amount"              integer,
  "remark"              varchar(100),
  "status"              varchar(100),
  "pay_id"              integer,
  "pay_time"            integer,
  "pay_type"            varchar(100),
  "pay_no"              varchar(100),
  "create_time"         datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "update_time"         datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);



CREATE TABLE "cd_user_suite"
(
  "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id"             integer,
  "product_id"          integer,
  "icon"                varchar(100),
  "title"               varchar(100),
  "max_domain_count"    integer,
  "max_pipeline_count"  integer,
  "max_deploy_count"    integer,
  "used_deploy_count"   integer,
  "site_monitor"        boolean,
  "expires_time"        integer,
  "disabled"            boolean  NOT NULL DEFAULT (false),
  "create_time"         datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "update_time"         datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);



