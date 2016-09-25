/* eslint no-console: "off", no-unused-vars: "off" , no-debugger: "off" */
import Schema from "./Model.js";
import yaml from "js-yaml";

let this_yargs;

const schema_command={
  command: "schema",
  describe: "schema management",
  builder: (yargs)=>{
    this_yargs=yargs.
      command("list","list schemas").
      command("ls", false).
      command("show <table>", "show schema");
    return this_yargs;
  },
  routing: (args, self, root_mapping)=>{
    if(!self instanceof Schema){
      throw TypeError("self must be instance of Schema");
    }

    let cmd = args._[ args._[0] === schema_command.command ? 1 : 0];

    let routing_table={
      "list": function(){
        return self.list().then( tables => {
          process.stdout.write(tables.map(v => v.name).join("\n")+"\n");
        });
      },
      "show": function(args){
        return self.show(args.table).then((info)=>{
          process.stdout.write(yaml.safeDump(info));
        });
      }
    };

    routing_table.ls=routing_table.list;

    if(cmd in routing_table){
      return routing_table[cmd](args);
    }

    this_yargs.showHelp();
  },
  target_class: Schema
};

export default schema_command;
