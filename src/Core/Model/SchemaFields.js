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
}

export default SchemaField;
