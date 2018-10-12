#!/usr/bin/env bash
set -e

alter_sql="alter user 'root' identified with mysql_native_password by 'root'"
drop_sql="drop database if exists test;"
create_sql="create database test;"

# Mysql setup
# docker exec -i mysql mysql -uroot -proot -e "$mysql"
docker exec -i mysql mysql -uroot -proot -e "$alter_sql"
docker exec -i mysql mysql -uroot -proot -e "$drop_sql"
docker exec -i mysql mysql -uroot -proot -e "$create_sql"

# Run the tests
npm test
