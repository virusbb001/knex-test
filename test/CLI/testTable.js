import Table from "../../src/CLI/Tables.js";
import chai from "chai";

let expect = chai.expect;

describe("Table",()=>{
  describe("align",()=>{
    it("should be frozen", ()=>{
      expect(Table.align).to.be.frozen;
    });
    it("should have props: left, right", ()=>{
      expect(Table.align).to.have.all.keys(["left","right"]);
    });
    describe("left" ,()=>{
      it("should make align left", ()=>{
        expect(Table.align.left("",5)).to.equal("     ");
        expect(Table.align.left("x",5)).to.equal("x    ");
        expect(Table.align.left(10,5)).to.equal("10   ");
      });
      it("should fill specified chara", ()=>{
        expect(Table.align.left("",5,"-")).to.equal("-----");
        expect(Table.align.left("x",5,"y")).to.equal("xyyyy");
        expect(Table.align.left(10,5,"l")).to.equal("10lll");
      });
    });
    describe("right" ,()=>{
      it("should make align right", ()=>{
        expect(Table.align.right("",5)).to.equal("     ");
        expect(Table.align.right("x",5)).to.equal("    x");
        expect(Table.align.right(10,5)).to.equal("   10");
      });
      it("should fill specified chara", ()=>{
        expect(Table.align.right("",5,"-")).to.equal("-----");
        expect(Table.align.right("x",5,"y")).to.equal("yyyyx");
        expect(Table.align.right(10,5,"l")).to.equal("lll10");
      });
    });
  });

  describe("isAlign",()=>{
    it("should return true when passed Table.align.*", ()=>{
      Object.keys(Table.align).map( key => {
        expect(Table.isAlign(Table.align[key])).to.be.ok;
      });
    });
    it("should return false when passed other than Table.align.*", ()=>{
      expect(Table.isAlign(114514)).to.not.be.ok;
      expect(Table.isAlign("hello")).to.not.be.ok;
      expect(Table.isAlign("left")).to.not.be.ok;
    });
  });

  describe("alignString",()=>{
    it("should return string of specifed length", ()=>{
      expect(Table.alignString("",3)).to.have.lengthOf(3);
      expect(Table.alignString("",0)).to.have.lengthOf(0);
      expect(Table.alignString(" ",3)).to.have.lengthOf(3);
    });
    it("should make string to the specified aligned", ()=>{
      expect(Table.alignString("x",3,Table.align.left)).to.equal("x  ");
      expect(Table.alignString("x",3,Table.align.right)).to.equal("  x");
    });
    it("should throw error when align is not right setting", ()=>{
      expect(()=>{
        Table.alignString("x",3,"nope");
      }).to.throw(Error);
    });
    it("should return target when width is less than target's string", ()=>{
      expect(Table.alignString("xxxx",3)).to.have.lengthOf(4);
    });
    it("should fill text by specified character", ()=>{
      expect(Table.alignString("x",3,undefined,"-")).to.equal("x--");
      expect(Table.alignString("",3,undefined,"-")).to.equal("---");
    });
    it("should throw error when fill character's length is not 1", ()=>{
      expect( ()=>{Table.alignString("x",3,undefined,"xx");}).to.throw(Error);
      expect( ()=>{Table.alignString("x",3,undefined,"あ");}).to.throw(Error);
    });
  });

  describe("isValidAlignSettings", ()=>{
    describe("parameter is single value", ()=>{
      it("should return true when param is Table.align", ()=>{
        expect(Table.isValidAlignSettings(Table.align.left)).to.be.ok;
      });
      it("should return false when param is not Table.align", ()=>{
        expect(Table.isValidAlignSettings(42)).to.not.be.ok;
      });
    });
    describe("parameter is array", ()=>{
      it("should return true when array's all value are Table.align", ()=>{
        expect(Table.isValidAlignSettings(
          [Table.align.left, Table.align.right]
        )).to.be.ok;
      });
      it("should return false when there is even one thing not Table.align",()=>{
        expect(Table.isValidAlignSettings(
          [Table.align.left, Table.align.right, 42]
        )).to.not.be.ok;
      });
      it("should return false when array's all value are not Table.align", ()=>{
        expect(Table.isValidAlignSettings([42,810,1919])).to.not.be.ok;
      });
    });
  });

  describe("wrapAlign", ()=>{
    describe("passed singleValue", ()=>{
      it("should return function which return specified align",()=>{
        var f = Table.wrapAlign(Table.align.left);
        expect(f()).to.equal(Table.align.left);
        expect(f("x",0)).to.equal(Table.align.left);
        expect(f("y",0,10)).to.equal(Table.align.left);
      });
    });
    describe("passed array", ()=>{
      it("should return function which return specified align",()=>{
        let f=Table.wrapAlign([Table.align.left, Table.align.right]);
        expect(f("",0,0)).to.equal(Table.align.left);
        expect(f("",0,1)).to.equal(Table.align.right);
      });
    });
    it("should throw error when param is not invalid", ()=>{
      expect(()=> Table.wrapAlign(42)).to.throw(Error);
      expect(()=> Table.wrapAlign([Table.align.left,42])).to.throw(Error);
    });
  });

  describe("commonDetermine", ()=>{
    it("should return right when passed number", ()=>{
      expect(Table.commonDeterminer(10)).to.equal(Table.align.right);
    });
    it("should return left when passed string", ()=>{
      expect(Table.commonDeterminer("10")).to.equal(Table.align.left);
    });
  });

  describe("tableString",()=>{
    it("should return aligned table string when header is null", ()=>{
      var rows=[
        ["a","  b","c"],
        ["dc","e","sf"],
        ["g g","hg","i"]
      ];

      var expect_rows=[
        ["a  ","  b","c "],
        ["dc ","e  ","sf"],
        ["g g","hg ","i "]
      ];

      var expect_table=expect_rows.map(row => row.join(" ")).join("\n");
      expect(Table.tableString(rows)).to.equal(expect_table);
    });
    it("should return specified aligned table", () =>{
      var rows=[
        ["a","  b","c"],
        ["dc","e","sf"],
        ["g g","hg","i"]
      ];

      var expect_rows=[
        ["  a","  b"," c"],
        [" dc","  e","sf"],
        ["g g"," hg"," i"]
      ];

      var expect_table=expect_rows.map(row => row.join(" ")).join("\n");
      expect(Table.tableString(rows,Table.align.right)).to.equal(expect_table);
    });
    it("should work well when each rows columns number is different",()=>{
      var rows=[
        ["a","  b","c"],
        ["dc","e"],
        ["g g"]
      ];

      var expect_rows=[
        ["a  ","  b","c"],
        ["dc ","e  "," "],
        ["g g","   "," "]
      ];

      var expect_table=expect_rows.map(row => row.join(" ")).join("\n");
      expect(Table.tableString(rows)).to.equal(expect_table);
    });
    it("should throw error when align_settings is not valid", ()=>{
      var rows=[
        ["a","  b","c"],
        ["dc","e"],
        ["g g"]
      ];

      expect(()=>{Table.tableString(rows,42);}).to.throw(Error);
    });
    it("should not throw and return empty string when [] has passed", ()=>{
      expect( ()=> Table.tableString([])).not.to.throw(Error);
      expect( Table.tableString([]) ).to.equal("");
    });
    it("should work well when some rows have number column",()=>{
      var rows=[
        [1,"ab","c"],
        [0,"ef","g"],
        [10,1,33]
      ];
      var expect_rows=[
        ["1 ","ab","c "],
        ["0 ","ef","g "],
        ["10","1 ","33"]
      ];

      var expect_table=expect_rows.map(row => row.join(" ")).join("\n");
      expect(Table.tableString(rows)).to.equal(expect_table);
    });
    it("should use determine when determine passed", ()=>{
      var determine = function(value){
        return typeof(value) === "number" ?
          Table.align.right :
          Table.align.left;
      };
      var rows=[
        ["id","text"],
        [1,"lorem"],
        ["x",10]
      ];
      var expect_rows=[
        ["id","text "],
        [" 1","lorem"],
        ["x ","   10"]
      ];

      var expect_table=expect_rows.map(row => row.join(" ")).join("\n");
      expect(Table.tableString(rows,determine)).to.equal(expect_table);
    });
  });

  describe("rows2table",()=>{
    it("should return expected table",()=>{
      var rows = [
        {id: 0, content: "hoge"},
        {id: 1, content: "fuga"},
        {id: 2, content: "foo"},
        {id: 3, content: "bar"},
      ];
      var header=["id","content"];

      var expect_rows = [
        ["id","content"],
        ["--","-------"],
        [" 0","hoge   "],
        [" 1","fuga   "],
        [" 2","foo    "],
        [" 3","bar    "],
      ];

      var expect_table=expect_rows.map(row => row.join(" ")).join("\n");
      expect(Table.rows2table(rows,header)).to.equal(expect_table);
    });
  });
});
