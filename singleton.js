let previousFilename = '';
let index = 0;
// const _data = [];
const _data = {};

const UserStore = {
  // improved singleton
  // add: (filename, contents) => {
  //     // console.log('NEW HELLO');
  //     if (previousFilename === filename) {
  //       index++;
  //       _data[index].contents.push(contents);
  //     } else {
  //       _data.push({'filename': filename, 'contents': [contents]});
  //       index = 0;
  //     }
  //     previousFilename = filename;
  // },

  add: (filename, contents) => {
      if (_data[filename]) {
        _data[filename].push(contents);
      } else {
        _data[filename] = [contents];
      }
  },
  getAll: () => _data
}

module.exports = UserStore;
