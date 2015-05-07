var fs = require('fs');
var Replacer = require('pattern-replace');

var SqlGenerator = function(options) {
  if (!options.hasOwnProperty('template') || typeof options.template !== 'object') {
    throw new Error ("Template é obrigatório");
  }

  if (!options.hasOwnProperty('resultFile')) {
    throw new Error ("Arquivo de Saída não informado.");
  }

  var template = options.template;
  var sql = [];

  if (template.hasOwnProperty('header')) {
    var templateHeader = fs.readFileSync(template.header).toString();
    sql.push(templateHeader);
  }

  var templateBody = fs.readFileSync(template.body).toString();

  /**
   * se não tiver fonte de dados, concatenar body com header e retornar ok.
   */
  if (!options.hasOwnProperty('data')) {
    sql.push(templateBody);

    var resultString = sql.join("\n");

    fs.writeFile(options.resultFile, resultString, 'utf-8', function(err, data) {
      if (err) {
        console.log(err);
      }

      console.log("\nSql gerada com sucesso.\nArquivo: " + options.resultFile);
    });

    return;
  }

  var dataJson = fs.readFileSync(options.data).toString();
  var data = JSON.parse(dataJson);

  data.forEach(function(jsonObject) {
    var replaceOptions = {
      patterns: [
        {
          json: jsonObject
        }
      ]
    };

    var replacer = new Replacer(replaceOptions);
    var result = replacer.replace(templateBody);
    sql.push(result);
  });

  var resultString = sql.join("\n");

  fs.writeFile(options.resultFile, resultString, 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }

    console.log("\nSql gerada com sucesso.\nArquivo: " + options.resultFile);
  });
};

module.exports = SqlGenerator;
