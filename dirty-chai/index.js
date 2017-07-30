const db = new Map();

function* idMaker() {
  var id = 0;
  while(id < Number.MAX_SAFE_INTEGER)
    yield id++;
}

const DBService = {

    create(value) {
      if(!value) {
        throw new Error('Value is null')
      }

      const id = value.id = idMaker();
      db.set(id, value);
      return value;
    },

    read(id) {
      if(!id) {
        throw new Error('Id is null')
      }
      
      return db.get(id);
    },

    update(value) {
      if(!value) {
        throw new Error('Value is null')
      } else if(!value.id) {
        throw new Error('Value has no id')
      }
      
      db.set(value.id, value);
      return value;
    },

    delete(value) {
      if(!value) {
        throw new Error('Value is null');
      } else if(!value.id) {
        throw new Error('Value has no id');
      } 
      
      db.delete(value.id);
    }
}

module.exports = DBService;