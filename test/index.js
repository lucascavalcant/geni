const fs = require('fs');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe("Geni module", () => {
  const Geni = require('../geni');
  var instance;

  it("should return a Geni instance.", (done) => {
    instance = new Geni();

    expect(instance).to.be.an.instanceof(Geni);

    done();
  });

  it("should have a 'generate' instance method.", (done) => {
    expect(instance.generate).to.be.a.function;

    done();
  });

  it("should throw error when invoking 'generate' without options object.", (done) => {
    expect(instance.generate).to.throw(Error);

    done();
  });

  it("should throw error when options is an empty object.", (done) => {
    expect(instance.generate.bind(instance, {})).to.throw(Error);

    done();
  });

  it("should throw error when template is not set.", (done) => {
    var options = {
      data: []
    };

    expect(instance.generate.bind(instance, options)).to.throw(Error);

    done();    
  });

  it("should throw error when template body is not set.", (done) => {
    var options = {
      template: {},
      data: []
    };

    expect(instance.generate.bind(instance, options)).to.throw(Error);

    done();
  });

  it("should throw error when setting template not as an Object.", (done) => {
    var options = {
      template: "randomstring",
      data: []
    };

    expect(instance.generate.bind(instance, options)).to.throw(Error);

    done();
  });

  it("should throw error when setting data not as an Array.", (done) => {
    var options = {
      template: './template/template.txt',
      data: {}
    };

    expect(instance.generate.bind(instance, options)).to.throw(Error);

    done();
  });

  it("should throw error when setting data as invalid json path.", (done) => {
    var options = {
      template: './template/template.txt',
      data: "./randompath/dontexist.json"
    };

    expect(instance.generate.bind(instance, options)).to.throw(Error);

    done();
  });

  it("should throw error when setting template body as invalid path.", (done) => {
    var options = {
      template: {
        body: './template/template.txt'
      },
      data: []
    };

    expect(instance.generate.bind(instance, options)).to.throw(Error);

    done();
  });

  it("should be able to receive string as template body, when setting isPath: false.", (done) => {
    var options = {
      template: {
        isPath: false,
        body: 'string @@key '
      },
      data: []
    };

    expect(instance.generate.bind(instance, options)).not.to.throw(Error);

    done();
  });

  it("should return template body as result when data is empty and return is not set.", (done) => {
    var options = {
      template: {
        isPath: false,
        body: 'key: "value"'
      },
      data: []
    };

    expect(instance.generate(options)).to.equal(options.template.body);

    done();
  });

  it("should write template body as result when data is empty and return is set.", (done) => {
     var options = {
      result: "./test/fixtures/result.txt",
      template: {
        isPath: false,
        body: 'key: "value"'
      },
      data: []
    };

    instance.generate(options);
    
    expect(fs.accessSync.bind(fs, options.result, fs.F_OK | fs.R_OK)).not.to.throw(Error);

    var result = fs.readFileSync(options.result).toString();

    expect(result).to.equal(options.template.body);

    done();
  });

  it("should replace template variables with json data.", (done) => {
    var options = {
      template: {
        isPath: false,
        body: 'key: @@key'
      },
      data: [
        { key: "value" }
      ]
    };

    var result = instance.generate(options);
    var expected = 'key: value';

    expect(result).to.equal(expected);

    done();
  });

  it("should repeat template foreach object in json array data.", (done) => {
    var options = {
      template: {
        isPath: false,
        body: 'key: @@key'
      },
      data: [
        { key: "value1" },
        { key: "value2" },
        { key: "value3" }
      ]
    };

    var result = instance.generate(options);
    var expected = 'key: value1\nkey: value2\nkey: value3';

    expect(result).to.equal(expected);

    done();
  });

  it("should be able to write using templates from files.", (done) => {
    var options = {
      template: {
        isPath: true,
        body: "./test/fixtures/template/template.txt"
      },
      data: [
        { key: "value1" },
        { key: "value2" },
        { key: "value3" }
      ]
    };

    var result = instance.generate(options);
    var expected = 'key: value1\nkey: value2\nkey: value3';

    expect(result).to.equal(expected);

    done();
  });

  it("should be able to write using json from files.", (done) => {
    var options = {
      template: {
        isPath: false,
        body: 'key: @@key'
      },
      data: "./test/fixtures/data/data.json"
    };

    var result = instance.generate(options);
    var expected = 'key: value1\nkey: value2\nkey: value3';

    expect(result).to.equal(expected);

    done();
  });

  it("should be able to write using both templates and json from files.", (done) => {
    var options = {
      template: {
        isPath: true,
        body: "./test/fixtures/template/template.txt"
      },
      data: "./test/fixtures/data/data.json"
    };

    var result = instance.generate(options);
    var expected = 'key: value1\nkey: value2\nkey: value3';

    expect(result).to.equal(expected);

    done();
  });

  it("should be able to write to a result file.", (done) => {
    var options = {
      result: "./test/fixtures/result.txt",
      template: {
        isPath: true,
        body: "./test/fixtures/template/template.txt"
      },
      data: "./test/fixtures/data/data.json"
    };

    instance.generate(options);
    
    expect(fs.accessSync.bind(fs, options.result, fs.F_OK | fs.R_OK)).not.to.throw(Error);

    var result = fs.readFileSync(options.result).toString();
    var expected = 'key: value1\nkey: value2\nkey: value3';

    expect(result).to.equal(expected);

    done();
  });

});
