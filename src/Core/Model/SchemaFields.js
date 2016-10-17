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

  /**
   * check saving infomation and actual column
   * it is check only having same name column
   */
  self_schema_check(){
    return this.knex(this.table_name).
      distinct("table_name").select().then(tables => {
        return Promise.all(tables.map(table_rows => {
          var table = table_rows.table_name;
          var actual_schema=this.knex(table).columnInfo().then(info => {
            return Object.keys(info);
          });
          var expect_schema=this.knex(this.table_name).
            select("field_name").where({
              table_name: table
            }).then(rows=>{
              return rows.map(row => row.field_name);
            });
          return Promise.all([actual_schema, expect_schema]).then(values=>{
            var actual_fields=values[0];
            var expect_fields=values[1];

            var actual_only_fields=actual_fields.filter(
              field => (expect_fields.indexOf(field) < 0)
            );
            var expect_only_fields=expect_fields.filter(
              field => (actual_fields.indexOf(field) < 0)
            );

            if(actual_only_fields.length > 0 || expect_only_fields.length > 0){
              var msg="difference detected\n" +
                (actual_only_fields.length > 0 ?
                  "actual: "+actual_only_fields.join(" ")+"\n" : "") +
                (expect_only_fields.length > 0 ?
                  "expect: "+expect_only_fields.join(" ")+"\n" : "");
              throw new Error(msg);
            }
          });
        }));
      });
  }

  /**
   * return then and pass schema is valid
   */
  /*
  check_fields(target){
    var target_field = target.fields;

    return this.knex(this.table_name).select("field_name", "type").
      where("table_name", target.table_name).then(function(raws){
        var fields = raws.map(raw => raw.field_name);
      });
  }
  */

}

/**
 * get left only value and right only values
 * it use Array.prototype.includes(it means compare by ===)
 */
function diff_array(left, right){
  return {
    left: left.filter(left_value => !right.includes(left_value)),
    right: right.filter(right_value => !left.includes(right_value))
  };
}

export default SchemaField;
export { diff_array };
