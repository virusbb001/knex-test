/* eslint no-console: "off" */
import fs from "fs";
import yaml from "js-yaml";

let Core = {
  load_yaml: function(filename){
    return yaml.safeLoad(
      fs.readFileSync(filename, "utf8")
    );
  },
  /**
   * return query to get all tables
   * sqlite only
   */
  all_tables: function(knex){
    var client = knex.client.config.client;
    var query;
    switch(client){
      case "sqlite":
        // query from sqlite's shell.c
        // select name from sqlite_master where type in ('table','view') and name not like 'sqlite_%' and name like "%";
        query = knex.select("name").
          from("sqlite_master").
          whereIn("type", ["table", "view"]).
          andWhereNot("name", "like", "sqlite_%");
        break;
      default:
        throw new TypeError(`client ${client} are still not supported`);
    }

    return query;
  }
};


export default Core;
