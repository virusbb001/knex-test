/** @module apps */
import Todo from "./Todo";
import Schema from "./Schema";

/** default command setting */
const default_key = "Todo";
export { default_key };

/**
 * dict of command list
 * key is used for editing
 */
export default {
  "Todo": Todo,
  "Schema": Schema,
};
