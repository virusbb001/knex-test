// See http://knexjs.org/#Schema-table to edit your table
// If you want to cancel, do not edit and just quit your editor

function change_schema(knex,table_name){
  /*
  return knex.transaction(function(trx){
    // table change here
    // example:
    return trx.schema.table(table_name, function(table){
      table.integer("priority").unsigned();
    });
  });
  */
}

module.exports = change_schema;
