/**
 * Base Model Class about using {@link http://knexjs.org/|knex}
 */
class KnexModel{
  /**
   * @param {_knex_instance} knex - knex instance to connect db
   */
  constructor(knex){
    this.knex=knex;
  }

  /**
   * @return {string} Table name
   */
  get table_name(){
    return this.constructor.name;
  }
  /**
   * It return columns list to use in {@link KnexModel#list}
   * It must be overrided when you make new apps
   *
   * @return {String[]} return columns to show
   */
  get list_column(){
    return [];
  }
  /**
   * return schema information
   */
  schema(){
    return this.knex.table(this.table_name).columnInfo();
  }

  // base functions

  /**
   * list all records
   * It returns the column that have been specified in
   * {@link KnexModel#list_column}
   */
  list(){
    return this.knex.select(...this.list_column).from(this.table_name);
  }
}

export default KnexModel;
