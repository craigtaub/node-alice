var fs = require('fs');

exports.default = function(fileContents) {

  var body = '';

  for (var key in fileContents) {
      body+= '<div>';
      body+= '<p>Filename: ' + key + '</p>';
      fileContents[key].forEach(function(value, key) {
        body+= '<p>Contents: ' + value + '</p>';
      });

      body+= '</div>';
  };

  fs.writeFileSync(__dirname + '/analysis.html', buildHtml(body));


  function buildHtml(body) {
    var header = 'Some Header';

    return '<!DOCTYPE html>'
         + '<html><header>' + header + '</header><body>' + body + '</body></html>';
  };
}
