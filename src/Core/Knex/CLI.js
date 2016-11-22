/**
 * Base CLI Class about {@link KnexModel}
 * It's property is followed in
 * {@link https://github.com/yargs/yargs#commandmodule | yargs commandModule}
 */


const base_commands={
  "list": {
    builder: yargs => yargs.
      command("list", "[alias: ls] list task").
      command("ls", false), // alias for list
    action: (self)=>{
      return self.list();
    }
  },
  "show": {
  }
};

export default base_commands;

// Use Object.assign and chain builder
