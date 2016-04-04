'use strict';

var fs = require('fs');
var PatternReplace = require('pattern-replace');

var writeFile = function(resultFilePath, content) {
  fs.writeFile(resultFilePath, content, 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }

    console.log("\nSql gerada com sucesso.\nArquivo: " + resultFilePath);
  });
};

class Gen {
  generate(options) {
    if (!options) {
      throw new Error ("options parameter is null.");
    }

    if (!Object.keys(options).length) {
      throw new Error ("options parameter is empty.");
    }

    if (!options.template) {
      throw new Error ("options.template path is null.");
    }

    var data = options.data;

    if (typeof data == 'string') {
      data = require(data);
    }

    if (typeof data == 'object') {
      throw new Error("options.data must be a json array.")
    }

    this.template = options.template;

  }
}

var SqlGenerator = function() {};


SqlGenerator.prototype.generate = function(options) {

  var template = options.template,
      sql = [];

  if (template.hasOwnProperty('header')) {
    var templateHeader = fs.readFileSync(template.header).toString();
    sql.push(templateHeader);
  }

  var templateBody;
  try {
    templateBody = fs.readFileSync(template.body).toString();
  } catch(e) {
    templateBody = template.body;
  }

  /**
   * se não tiver fonte de dados, concatenar body com header e retornar ok.
   */
  if (!options.hasOwnProperty('data')) {
    sql.push(templateBody);

    if(template.hasOwnProperty('footer')) {
      var templateFooter = fs.readFileSync(template.footer).toString();
      sql.push(templateFooter);
    }

    var resultString = sql.join("\n");
    writeFile(options.resultFile, resultString);

    return;
  }

  var dataJson = fs.readFileSync(options.data).toString();
  var data = JSON.parse(dataJson);

  data.forEach(function(jsonObject, index) {
    var replaceOptions = {
      patterns: [ { json: jsonObject } ]
    };

    var replacer = new PatternReplace(replaceOptions);
    var result = replacer.replace(templateBody);

    /**
     * slice last comma
     */
    if (index == data.length - 1) {
      var comma = result.lastIndexOf(",");

      if (comma !== -1) {
        console.log("cortando ultima virgula de " + template.body + "..");
        result = result.slice(0, comma);
      }
    }

    sql.push(result);
  });

  if(template.hasOwnProperty('footer')) {
    var templateFooter = fs.readFileSync(template.footer).toString();
    sql.push(templateFooter);
  }

  writeFile(options.resultFile, sql.join(""));
};

module.exports = Gen;
