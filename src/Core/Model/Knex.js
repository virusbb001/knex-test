class KnexModel{
  constructor(knex){
    this.knex=knex;
  }
  get table_name(){
    return this.constructor.name;
  }
  get list_column(){
    return [];
  }
  schema(){
    return this.knex.table(this.table_name).columnInfo();
  }

  // base functions

  // list all records
  list(){
    return this.knex.select(...this.list_column).from(this.table_name);
  }
}

export default KnexModel;
