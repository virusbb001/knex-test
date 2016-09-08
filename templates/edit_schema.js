// See http://knexjs.org/#Schema-table to edit your table
// I trust you ;)

function change_schema(knex,table_name){
  return knex.transaction(function(trx){
    // table change here
    // example:
    return trx.schema.table(table_name, function(table){
      table.integer("priority").unsigned();
    });
  });
}

