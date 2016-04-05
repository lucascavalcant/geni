'use strict';

const fs = require('fs');
const PatternReplace = require('pattern-replace');

class Gen {
  generate(options) {
    var options = Gen.validate(options);

    if (!options.data.length) {
      return options.template.body;
    }

    var result = [];

    options
    .data
    .forEach((object) => {
      var replacer = new PatternReplace({
        patterns: [ { json: object } ]
      });

      result.push(replacer.replace(options.template.body));
    });

    if (!options.result) {
      return result.join("\n");
    }

    fs.writeFileSync(options.result, result.join("\n"), 'utf-8');
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

module.exports = Gen;
