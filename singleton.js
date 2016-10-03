let previousFilename = '';
let index = -1;
let _data = [];
let listenerStatus = false;
let previousContents = '';
let reset = false;

const UserStore = {
  add: (filename, contents) => {
      if (previousContents === contents) {
        previousContents = contents;
        return;
      }
      if (previousFilename === filename) {
          _data[index].contents.push(contents);
      } else {
        _data.push({'filename': filename, 'contents': [contents]});
        index++;
      }
      previousContents = contents;
      previousFilename = filename;
  },
  getAll: () => _data,
  clearAll: () => {
      _data = [];
      index = -1;
  },
  setListener: () => listenerStatus = true,
  getListener: () => listenerStatus,
  setReset: () => reset = true,
  getReset: () => reset
}

module.exports = UserStore;
