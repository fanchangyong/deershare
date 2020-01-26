
const cache = {};

function get(key) {
  return cache[key];
}

function set(key, value) {
  cache[key] = value;
}

const exports = {
  get,
  set,
};

export default exports;
module.exports = exports;
