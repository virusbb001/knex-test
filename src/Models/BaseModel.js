class BaseModel {
  constructor(knex){
    this.knex=knex;
  }
  get table_name(){
    return this.constructor.name;
  }
  schema(){
    return this.knex.table(this.table_name).columnInfo();
  }
}

export default BaseModel;
