/* eslint no-console: off */
import KnexModel from "./Knex";

class SchemaField extends KnexModel{
  get fields(){
    return {
      "table_name": "string",
      "field_name": "string",
      "type": "string",
      "#unique": [["table_name", "field_name"]]
    };
  }

  saved_field(table){
    return this.knex.select().from(this.table_name).where({
      table_name: table
    });
  }

  create_table(table_class){
    var fields = table_class.fields;
    return this.knex.schema.createTable(table_class.table_name, function(t){
      for(var field in fields){
        if(field == "#unique"){
          fields[field].forEach(unique_field => {
            t.unique(unique_field);
          });
          continue;
        }
        switch(fields[field]){
          case "int":
            t.integer(field);
            break;
          case "string":
            t.string(field);
            break;
          case "text":
            t.text(field);
            break;
          default:
            throw new Error("not implemented yet");
        }
      }
    });
  }
}

export default SchemaField;
