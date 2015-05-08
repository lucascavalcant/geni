var fs = require('fs');
var Replacer = require('pattern-replace');
var sqlParser = require('sql-parser');

var writeFile = function(resultFilePath, content) {
  fs.writeFile(resultFilePath, content, 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }

    console.log("\nSql gerada com sucesso.\nArquivo: " + resultFilePath);
  });
};

var SqlGenerator = function() {};

SqlGenerator.prototype.singleValueUpdate = function(options) {
  if (!options.hasOwnProperty('table')) {
    throw new Error ("Tabela é obrigatório");
  }

  if (!options.hasOwnProperty('field')) {
    throw new Error ("Field é obrigatório");
  }

  if (!options.hasOwnProperty('dataType')) {
    throw new Error ("DataType é obrigatório");
  }

  var newSelector, oldSelector;

  switch(options.dataType) {
    case 'string':
    case 'json':
      newSelector = "'@@new'";
      oldSelector = "'@@old'";
      break;

    default:
      newSelector = "@@new";
      oldSelector = "@@old";
  }

  return "update " + options.table + " set " + options.field + " = " + newSelector + " WHERE " + options.field + " = " + oldSelector + "\n";
};

SqlGenerator.prototype.generate = function(options) {
  if (!options.hasOwnProperty('template') || typeof options.template !== 'object') {
    throw new Error ("Template é obrigatório");
  }

  if (!options.hasOwnProperty('resultFile')) {
    throw new Error ("Arquivo de Saída não informado.");
  }

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
      patterns: [
        {
          json: jsonObject
        }
      ]
    };

    var replacer = new Replacer(replaceOptions);
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

module.exports = SqlGenerator;
