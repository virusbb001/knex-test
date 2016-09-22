/* eslint no-console: "off", no-debugger: "off" */
import inquirer from "inquirer";

import BaseModel from "./BaseModel";
import Table from "../CLI/Tables.js";

class Todo extends BaseModel{
  get table_name(){
    return "todos";
  }
  get list_column(){
    return ["id","taskname"];
  }

  /**
   * 全件テーブルにして表示
   *
   * @todo 表示機能消しても良いかもしれない
   */
  list(){
    return this.knex.select(...this.list_column).from(this.table_name)
      .then(rows => {
        process.stdout.write(Table.rows2table(rows,this.list_column)+"\n");
      });
  }

  /**
   * IDから1つ選んでそれを変える
   */
  show(id){
    return this.knex.select().where("id",id).from(this.table_name);
  }

  /**
   * タスク追加
   *
   * @param {string} task - task name
   * @param {string} descriptions - task's description
   */
  add(task,description){
    return this.knex.insert({
      taskname: task,
      description: description
    }).into(this.table_name).then((e)=>{
      console.log(description);
      console.log(e);
    }).catch( (e)=>{
      process.stderr.write("error\n");
      console.log(e);
    });
  }

  /**
   * remove todo_id from todo list
   *
   * @param {number} task - task id
   */
  remove(task){
    var task_id = parseInt(task);
    if(isNaN(task_id)){
      throw new Error("task_id is not number");
    }
    var query = this.knex.table(this.table_name).where("id",task_id);
    return query.clone().select(this.list_column).then(rows => {
      process.stdout.write("will removed\n\n");
      process.stdout.write(Table.rows2table(rows,this.list_column)+"\n");
    }).then( ()=>{
      return inquirer.prompt({
        type: "confirm",
        name: "remove",
        message: "Are you really remove?",
        default: false
      });
    }).then( answer => {
      if(answer.remove){
        return this.knex.table(this.table_name).where("id", task_id).del().
          then( ()=>{
            console.log("resolved");
            console.log(arguments);
          }, ()=>{
            console.log("rejected");
            console.log(arguments);
          });
      }
    });
  }

  update(_task_id, task, description){
    // inquirer
    // のeditorでテンプレート読みだしてdefault設定するとエディタで出てくる
    console.log("task is");
    console.log(task);
    console.log("description is");
    console.log(description);
  }
}

export default Todo;
