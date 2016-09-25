const _data = {};

const UserStore = {
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
