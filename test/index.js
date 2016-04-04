const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const Gen = require('../gen');

describe("Gen module", () => {
  var instance;

  it("should return a Gen instance.", (done) => {
    instance = new Gen();

    expect(instance).to.be.an.instanceof(Gen);

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

  it("should throw error when template body is not set.", (done) => {
    var options = {
      data: []
    };

    expect(instance.generate.bind(instance, options)).to.throw(Error);

    done();
  });

  it("should throw error when not senting json array as data param", (done) => {
    var options = {
      template: './template/template.txt',
      data: {}
    };

    expect(instance.generate.bind(instance, options)).to.throw(Error);

    done();
  });

  it("should throw error when setting invalid json path.", (done) => {
    var options = {
      template: './template/template.txt',
      data: "./randompath/dontexist.json"
    };

    expect(instance.generate.bind(instance, options)).to.throw(Error);

    done();
  });

  it("should throw error when setting invalid template body path.");
  it("should show result in stdout when 'result' is not set.");
  it("should replace template variables with json data.");
});
