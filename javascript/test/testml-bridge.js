// Generated by CoffeeScript 2.5.1
(function() {
  var TestMLBridge;

  require('../../test/testml/src/node/lib/testml/bridge');

  require('../lib/prelude');

  require('../lib/parser');

  require('../lib/grammar');

  require('../lib/test-receiver');

  module.exports = TestMLBridge = class TestMLBridge extends TestML.Bridge {
    parse(yaml) {
      var e, error, parser;
      parser = new Parser(new TestReceiver());
      error = '';
      try {
        parser.parse(yaml);
      } catch (error1) {
        e = error1;
        error = String(e);
      }
      if (error) {
        return error;
      } else {
        return parser.receiver.output();
      }
    }

    unescape(yaml) {
      return yaml.replace(/<SPC>/g, ' ').replace(/<TAB>/g, "\t");
    }

  };

}).call(this);
