// See http://knexjs.org/#Schema-table to edit your table
// If you want to cancel, do not edit anything and just quit editor

// available type is
// integer, text, string, float, decimal, boolean,
// date, dateTime, time, timestamp, binary, enum, other various...
function change_schema(knex,table_name){
  /*
  return knex.transaction(function(trx){
    return trx.schema.table(table_name, function(table){
      table.integer("priority").unsigned();
    });
  });
  */
}

module.exports = change_schema;
