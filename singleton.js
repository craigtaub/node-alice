let previousFilename = '';
let index = -1;
let _data = [];
let listenerStatus = false;

const UserStore = {
  add: (filename, contents) => {
      if (previousFilename === filename) {
          _data[index].contents.push(contents);
      } else {
        _data.push({'filename': filename, 'contents': [contents]});
        index++;
      }
      previousFilename = filename;
  },
  getAll: () => _data,
  clearAll: () => {
      _data = [];
      index = -1;
  },
  setListener: () => listenerStatus = true,
  getListener: () => listenerStatus
}

module.exports = UserStore;
