/* eslint no-console: "off", no-unused-vars: "off" , no-debugger: "off" */

import os from "os";
import path from "path";

import fs from "fs-extra";
import yaml from "js-yaml";
import editor from "editor";

import Todo from "./Model.js";

let this_yargs;

const todo_command={
  command: "todo",
  describe: "todo management",
  builder: (yargs)=>{
    var remove_builder= (yargs =>
      yargs.
        boolean("force").
        describe("force", "don't ask when removing task").
        alias("f", "force").
        help()
    );
    this_yargs=yargs.
      command("list","[alias: ls] list task").
      command("ls",false). // alias for list
      command("add <name...>", "add task",(yargs)=>{
        return yargs.
          usage("$0 todo add <task name here> "
            +"--describe <task description here>").
          example(
            "$0 todo add to do it --describe just do it",
            "add todo which name is \"to do it\" and "
            + "description is \"just do it\" to database"
          ).
          array("describe").
          describe("describe", "description string...");
      }).
      command("remove <id>", "remove task from todo list", remove_builder).
      command("rm <id>", false, remove_builder). // alias for remove
      command("update <id>", "update task", (yargs)=>{
        return yargs.
          array("name").
          describe("name", "task name...").
          array("description").
          describe("description","task description").
          help();
      }).
      command("edit <id>", "edit id with $EDITOR", yargs => {
        return yargs.
          usage("edit <id or \"schema\">").
          example("edit schema", "edit schema").
          help();
      }).
      command("show <id>", "show more information of task", yargs => {
        return yargs.
          usage("show [options] <id or \"schema\">").
          boolean("json").
          describe("json", "show with json").
          example("show 1", "show about task #1").
          example("show schema", "show schema of Todo").
          help();
      }).
      help();
    return this_yargs;
  },
  /**
   * routing function
   *
   * @param {string[]} args - arguments
   * @param {Todo} self - using Todo's instance
   */
  routing: (args,self)=>{
    if(!self instanceof Todo){
      throw TypeError("self must be instance of Todo");
    }

    let routing_table={
      list: function(){
        return self.list();
      },
      add: function(args){
        var description = (args.describe && args.describe.length > 0)
          ? args.describe.join(" ")
          : null;
        return self.add(args.name.join(" "), description);
      },
      remove: function(args){
        var id=parseInt(args.id);
        if(isNaN(id)){
          process.stderr.write("id is not number\n"+
            "use --help for more information\n");
          return;
        }
        return self.remove(id);
      },
      update: function(args){
        var id=parseInt(args.id);
        if(isNaN(id)){
          process.stderr.write("id is not number\n"+
            "use --help for more information\n");
          return;
        }
      },
      show: function(args){
        if(args.id === "schema"){
          return self.schema().then(schema =>
            yaml.safeDump(schema)
          ).then(schema_yaml => {
            process.stdout.write(schema_yaml+"\n");
          });
        }
        if(isNaN(args.id-0)){
          process.stderr.write("id is not number\n"+
            "use --help for more information\n");
          return;
        }
        return self.show(args.id).then(infos =>
          infos.map(info => {
            for(var key in info){
              if(info[key] === undefined || info[key] === null){
                delete info[key];
              }
            }
            return info;
          })
        ).then(infos => {
          return args.json ? JSON.stringify(infos) : yaml.safeDump(infos);
        }).then(info_yaml => {
          process.stdout.write(info_yaml + "\n");
        });
      },
      edit: function(args){
        const template_path = path.join(
          __dirname, "../../templates/edit_schema.js");

        if(args.id === "schema"){
          var edit = new Promise(function(resolve, reject){
            var tempfile = path.join(os.tmpdir(), "todo_"+ Date.now()+".js");
            fs.copy(template_path, tempfile,function(err){
              if(err){
                reject(err);
              }else{
                resolve(tempfile);
              }
            });
          });
          return edit.then(function(filename){
            return new Promise(function(resolve, reject){
              editor(filename, function(code, sig){
                code > 0 ? reject(code, sig) : resolve(filename);
              });
            });
          }).then(function(filename){
            var f=require(filename);
            f(self.knex, self.table_name);
            return filename;
          }).then(function(filename){
            return new Promise(function(resolve, reject){
              fs.unlink(filename, function(err){
                err ? reject(err) : resolve();
              });
            });
          }).then(function(){
            console.log("removed");
          }).catch(function(e){
            console.error(e);
          });
        }

      }
    };
    routing_table.ls = routing_table.list;
    routing_table.rm = routing_table.remove;

    let cmd = args._[0];

    if(cmd in routing_table){
      return routing_table[cmd](args);
    }

    this_yargs.showHelp();
    return;
  },
  // target class
  target_class: Todo
};

export default todo_command;
