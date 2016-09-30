let previousFilename = '';
let index = -1;
let _data = [];
// let _data = {};

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

  // old format
  // add: (filename, contents) => {
  //     if (_data[filename]) {
  //       _data[filename].push(index + contents);
  //     } else {
  //       _data[filename] = [index + contents];
  //     }
  //     index++;
  // },
  getAll: () => _data,
  clearAll: () => {
      // _data = {};
      _data = [];
      index = -1;
  }
}

module.exports = UserStore;
