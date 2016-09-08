import eaw from "eastasianwidth";

/**
 * CLIでテーブル書く奴の関数の集合
 */
let Table = {
  /**
   * 幅揃えの設定
   * left: 文字を左に
   * right: 文字を右に
   */
  align: Object.freeze({
    left: function(text, width, fill = " "){
      return text + fill.repeat(Math.max(width- eaw.length(""+text), 0));
    },
    right: function(text, width, fill = " "){
      return fill.repeat(Math.max(width- eaw.length(""+text), 0)) + text;
    }
  }),

  /**
   * alignが正しいかどうか判定する
   * @param {Table.align} align - 検査対象
   */
  isAlign(align){
    return Object.keys(Table.align)
    .map(key => Table.align[key])
    .includes(align);
  },

  /**
   * textをalignの設定でwidthの大きさで詰める
   * text.length > widthならそのまま
   * @param {string} text - テキスト
   * @param {number} width - 幅
   * @param {Table.align} align - 設定
   */
  alignString(text, width, align = Table.align.left, fill=" "){
    if(eaw.length(fill) != 1){
      throw new TypeError("fill character length must be 1");
    }

    if (Table.isAlign(align)) {
      return align(text,width,fill);
    }else{
      throw new TypeError("align should be column_align's property");
    }
  },

  /**
   * row[][]をCLI用のテーブルをいい感じに返す
   * @param row[][] 表示する奴
   * @param function(value,row_index,column_index)->Table.align align_determiner
   *  Table.alignで指定
   *  デフォルトは左詰め
   */
  tableString(rows, align_determiner=Table.align.left){
    if(!Table.isValidAlignSettings(align_determiner) && !align_determiner.call){
      throw TypeError("align_settings must be Table.align.*");
    }
    let determiner = Table.isValidAlignSettings(align_determiner) ?
      Table.wrapAlign(align_determiner) :
      align_determiner;

    let columns_size = Table.getColumnSize(rows);
    return rows.map( (columns,row_index)=>
        columns_size.map((size,column_index)=>
            Table.alignString(
              columns[column_index] === undefined ? "" : ""+columns[column_index],
              size, determiner(columns[column_index],row_index, column_index)
            )
        ).join(" ")
    ).join("\n");
  },

  /**
   * 正しいalign settingsか判定する
   * @param {(Table.align | Table.align[])} align_settings
   */
  isValidAlignSettings(align_settings){
    return Array.isArray(align_settings)
    ? align_settings.reduce(
      (prevRes, value) => prevRes && Table.isAlign(value) , true)
      : Table.isAlign(align_settings);
  },

  /**
   * 行列の列の最大数を取得する
   */
  getColumnSize(rows){
    return rows.reduce((prev,current) =>
        prev.map( (prev_value,index)=>
            Math.max(prev_value, eaw.length(
              current[index] !== undefined ? String(current[index]) : "")
            )
        )
      , Array(Table.getColumnNumber(rows)).fill(0));
  },

  /**
   * 列の数を取得する
   */
  getColumnNumber(rows){
    return Math.max(...( rows.map(row=>row.length).concat(0) ));
  },

  /**
   * align|align[]をラップするもの
   */
  wrapAlign(align){
    if(!Table.isValidAlignSettings(align)){
      throw new TypeError("align must be valid align");
    }
    if(Array.isArray(align)){
      return (_value, _row_index, column_index) =>
        align[column_index];
    }else{
      return (_value, _row_index, _column_index) => align;
    }
  },

  commonDeterminer(value){
    return typeof(value) === "number" ?
    Table.align.right :
    Table.align.left;
  },

  rows2table(rows,header){
    var body= rows.map( row=> header.map(prop => row[prop]));
    var split = Table.getColumnSize([header].concat(body)).
      map(v => "-".repeat(v));
    return Table.tableString(
      [header,split].concat(body),Table.commonDeterminer
    );
  }
};

export default Table;
