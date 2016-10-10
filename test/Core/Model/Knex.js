import knexModel from "../../../src/Core/Model/Knex.js";

import Knex from "knex";
import chai from "chai";

var expect=chai.expect;

describe("KnexModel", ()=>{
  var knex,
    subject;

  before(() => {
    knex=new Knex({
      client: "sqlite3",
      useNullAsDefault: true,
      connection: {
        filename: ":memory:"
      }
    });
    subject=new knexModel(knex);
  });

  after(done => {
    knex.destroy(done);
  });

  it("should have knex property which is exist", ()=>{
    expect(subject).to.have.property("knex");
    expect(subject.knex).to.exist;
  });

  describe("table_name", ()=>{
    it("should return constructor name", ()=>{
      expect(subject.table_name).to.equal("KnexModel");
    });
  });

  describe("schema", ()=>{
    it("should return thenable", (done)=>{
      var result=subject.schema();
      expect(result).to.have.property("then");
      result.then(()=>{ done(); });
    });
  });

  describe("base functions", ()=>{
    describe("list", ()=>{
      it("should return thenable", ()=>{
        var result=subject.list();
        expect(result).to.have.property("then");
      });
    });
  });
});
