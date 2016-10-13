/* eslint no-console: off */
import SchemaFields from "../../../src/Core/Model/SchemaFields.js";
import KnexModel from "../../../src/Core/Model/Knex.js";
// import chai from "chai";

import Knex from "knex";
import chai from "chai";

var expect = chai.expect;

describe("SchemaFields", ()=>{
  var knex, subject;
  var test_table="test_table";
  var test_table_2="test_table_2";

  before(()=>{
    knex=new Knex({
      client: "sqlite3",
      connection: {
        filename: ":memory:"
      },
      useNullAsDefault: true
    });

    subject=new SchemaFields(knex);

    return knex.schema.createTable(subject.table_name, function(table){
      table.string("table_name");
      table.string("field_name");
      table.string("type");
      table.unique(["table_name", "field_name"]);
    });
  });

  after(()=>{
    return knex.destroy();
  });

  describe("saved_field", ()=>{
    before(()=>{
      return knex(subject.table_name).insert([
        {
          "table_name": test_table,
          "field_name": "field_1",
          "type": "string"
        }, {
          "table_name": test_table,
          "field_name": "field_2",
          "type": "string"
        }, {
          "table_name": test_table_2,
          "field_name": "field_1",
          "type": "int"
        }, {
          "table_name": test_table_2,
          "field_name": "field_2",
          "type": "int"
        }
      ]);
    });

    after(()=>{
      return knex(subject.table_name).delete();
    });

    it("should return thenable", ()=>{
      expect(subject.saved_field(test_table)).to.have.property("then");
    });

    it("should pass record only specified table name", ()=>{
      subject.saved_field(test_table).then(columns => {
        for(const column of columns){
          expect(column.table_name).to.equal(test_table);
        }
      });
    });
  });

  describe("create_table", ()=>{
    var target_class=class extends KnexModel{
      get fields(){
        return {
          "field_int": "int",
          "field_str": "string",
          "unique_int": "int",
          "unique_pair_a": "string",
          "unique_pair_b": "string",
          "#unique": [ "unique_int", ["unique_pair_a", "unique_pair_b"]]
        };
      }
    };

    var target = new target_class(knex);

    before(()=>{
      return subject.create_table(target);
    });

    after(()=>{
      return knex.schema.dropTableIfExists(target.table_name);
    });

    it("should create table", ()=>{
      return knex.schema.hasTable(target.table_name).then(function(exists){
        expect(exists).to.be.true;
      });
    });
    it("should specified column", ()=>{
      return knex(target.table_name).columnInfo().then( info=>{
        expect(info).to.have.property("field_int");
        expect(info).to.have.property("field_str");
      });
    });

    describe("make unique column", ()=>{
      before(done=>{
        knex(target.table_name).insert({
          field_int: 0,
          field_str: "",
          unique_int: 0,
          unique_pair_a: "a",
          unique_pair_b: "b"
        }).then(()=>{done();});
      });

      it("should set single unique column", (done)=>{
        knex(target.table_name).insert({
          field_int: 0,
          field_str: "",
          unique_int: 0,
          unique_pair_a: "another_a",
          unique_pair_b: "another_b"
        }).then(function(){
          done(new Error("unique_int must be unique but accepted"));
        }).catch(function(e){
          expect(e).to.match(/unique/i);
          done();
        });
      });

      it("should set paired unique columns", (done)=>{
        knex(target.table_name).insert({
          field_int: 0,
          field_str: "",
          unique_int: 1,
          unique_pair_a: "a",
          unique_pair_b: "b"
        }).then(function(){
          done(new Error("unique_int must be unique but accepted"));
        }).catch(function(e){
          expect(e).to.match(/unique/i);
          done();
        });
      });
    });
  });

  describe("self check schema", ()=>{
    afterEach(()=>{
      return Promise.all([test_table, test_table_2].map(table=>{
        return knex.schema.dropTableIfExists(table);
      })).then(()=>{
        return knex(subject.table_name).
          whereIn("table_name", [test_table, test_table_2]).
          del();
      });
    });

    it("should be ok when saved in schema table and actual column are same",
      ()=>{
        return knex.schema.createTable(test_table, (table)=>{
          table.string("field_1");
          table.integer("field_2");
        }).then(()=>{
          return knex(subject.table_name).insert([
            {
              "table_name": test_table,
              "field_name": "field_1",
              "type": "string"
            }, {
              "table_name": test_table,
              "field_name": "field_2",
              "type": "integer"
            }
          ]);
        }).then(()=>{
          return subject.self_schema_check();
        });
      }
    );
    it("should be not ok when actual column are missing",
      (done)=>{
        knex.schema.createTable(test_table, (table)=>{
          table.string("field_1");
          table.integer("field_2");
          table.text("field_3");
        }).then(()=>{
          return knex(subject.table_name).insert([
            {
              "table_name": test_table,
              "field_name": "field_1",
              "type": "string"
            }, {
              "table_name": test_table,
              "field_name": "field_2",
              "type": "integer"
            }
          ]);
        }).then(()=>{
          return subject.self_schema_check();
        }).then(()=>{
          done(new Error("field_3 is saved but self check is ok"));
        }, e=>{
          expect(e).to.match(/field_3/i);
          done();
        });
      }
    );
  });
});
