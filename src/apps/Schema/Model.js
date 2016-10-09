// meta

class Schema {
  constructor(knex){
    this.knex=knex;
  }

  list(){
    var client = this.knex.client.config.client;
    var query;
    switch(client){
      case "sqlite":
        // query from sqlite's shell.c
        // select name from sqlite_master
        // where type in ('table','view')
        // and name not like 'sqlite_%' and name like "%";
        query = this.knex.select("name").
          from("sqlite_master").
          whereIn("type", ["table", "view"]).
          andWhereNot("name", "like", "sqlite_%");
        break;
      default:
        throw new TypeError(`client ${client} are still not supported`);
    }

    return query;
  }

  show(table_name){
    return this.knex.table(table_name).columnInfo();
  }
}

export default Schema;
