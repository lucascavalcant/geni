'use strict';

const fs = require('fs');
const Replacer = require('pattern-replace');

module.exports = class Geni {
  generate(options) {
    var options = Geni.validate(options);

    var result = options.data.map((json) => {
      var replacer = new Replacer({
        patterns: [ { json } ]
      });

      return replacer.replace(options.template.body);
    });

    var final = (!options.data.length) ? options.template.body : result.join("\n");

    if (!options.result) {
      return final;
    }

    fs.writeFileSync(options.result, final, 'utf-8');
  }

  static validate(options) {
    if (!options) {
      throw new Error ("options parameter is null.");
    }

    if (!Object.keys(options).length) {
      throw new Error ("options parameter is empty.");
    }

    if (!'template' in options) {
      throw new Error ("options.template cant be null.");
    }

    if (typeof options.template != 'object') {
      throw new Error("options.template must be a object.")
    }

    if (!options.template.body) {
      throw new Error("options.template.body cant be null.");
    }

    if (typeof options.data == 'string') {
      options.data = require(options.data);
    }

    if (!Array.isArray(options.data)) {
      throw new Error("options.data must be a array.")
    }

    if ('isPath' in options.template) {
      if (!options.template.isPath) {
        return options;
      } 
    } 

    try {
      fs.accessSync(options.template.body, fs.F_OK | fs.R_OK);
      options.template.body = fs.readFileSync(options.template.body).toString();
    } catch (e) {
      throw new Error("options.template.body is not a readable file.")
    }

    return options;
  }
}
