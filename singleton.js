let previousFilename = '';
let index = -1;
let _data = [];
let listenerStatus = false;
let previousContents = '';

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
  getListener: () => listenerStatus
}

module.exports = UserStore;
