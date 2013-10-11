# Component Styl Plugin

Plugin for [component/builder](http://github.com/component/builder.js) to enable the direct use of styl/rework with components.


## Usage Example

    var Builder  = require('component-builder'),
    stylPlugin = require('component-styl-plugin');

    var builder = new Builder('.');
    builder.copyAssetsTo('public');
    builder.use(stylusPlugin);

    builder.build(function(err, res) {
      write('public/app.js', res.require + res.js);
      write('public/app.css', res.css);
    });

## Options

Component Styl Plugin is highly customizable and exhibits a lot of the options that styl itself has, and even some it doesn't.

### Includes

Include the selected files before compiling a file. Useful for things like
variables and mixins.

    stylPlugin.includes = ['./pages/global/stylDefinitions.styl'];

### Plugins

Add rework plugins to the styl plugin.

    stylPlugin.plugins = [rework.references(), require('rework-variant')()];
