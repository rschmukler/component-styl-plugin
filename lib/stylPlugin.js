var Styl  = require('styl'),
      path  = require('path'),
        fs  = require('fs'),
     Batch  = require('batch'),
     debug  = require('debug')('component:stylPlugin'),
      read  = fs.readFileSync;

var stylPlugin = module.exports = function stylPlugin(builder) {
  debug('Loading Styl Plugin');
  builder.hook('before styles', function(pkg, next) {
    var styles = pkg.config.styles;
    if (!styles) return next();

    var stylusFiles = styles.filter(function(file) { return path.extname(file) == '.styl';});

    if(!stylusFiles.length) return next();

    batch = new Batch();
    var includeText = "";
    stylPlugin.includes.forEach(function(include) {
      contents = read(include, 'utf-8');
      includeText += contents + '\n';
    });

    stylusFiles.forEach(function(styl) {


      batch.push(function(done) {
        var filePath = pkg.path(styl);
        pkg._files[styl] = stylPlugin.compileFunction(filePath, includeText);
        done();
      });
    });
    batch.end(next);
  });
};

stylPlugin.compress = false;
stylPlugin.vendors = ['-o-','-ms-','-moz-','-webkit-'];
stylPlugin.surgeonSupport = true;
stylPlugin.whitespace = true;
stylPlugin.plugins = [];
stylPlugin.includes = [];
stylPlugin.compileFunction = function compileFunction(filePath, includeText) {
  var splitPath = filePath.split('/');
  debug("Compiling File: " + splitPath[splitPath.length - 2] + '/' + splitPath[splitPath.length - 1]);

  // Load info about the file
  var contents = read(filePath, 'utf-8');
      file     = path.basename(splitPath[splitPath.length - 1], '.styl') + '.css';

  // Set some options
  var options = {
    compress: stylPlugin.compress,
    whitespace: stylPlugin.whitespace,
  };


  contents = includeText + contents;

  var renderer = new Styl(contents, options);
  renderer.vendors(stylPlugin.vendors);

  stylPlugin.plugins.forEach(function(plugin) {
    renderer.use(plugin);
  });
  var result;
  if(stylPlugin.surgeonSupport) {
    contents = renderer.toString();
    var numLines = contents.split('\n').length;
    var relativePath = path.relative(process.cwd(), filePath);
    result = '/*SurgeonFile: ' + relativePath + ', numLines: ' + (numLines + 1) + '*/\n' + contents;
  } else
    result = renderer.toString();

  return result;
};
//stylPlugin = Styl.rework;
