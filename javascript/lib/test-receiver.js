// Generated by CoffeeScript 2.5.1
(function() {
  var TestReceiver;

  require('./prelude');

  global.TestReceiver = TestReceiver = class TestReceiver {
    constructor() {
      this.event = [];
      this.cache = [];
    }

    add(type, value) {
      var event;
      event = {
        type: type
      };
      if (type != null) {
        if (this.marker != null) {
          event.marker = this.marker;
          delete this.marker;
        }
        if (this.anchor != null) {
          event.anchor = this.anchor;
          delete this.anchor;
        }
        if (this.tag != null) {
          event.tag = this.tag;
          delete this.tag;
        }
      }
      if (value != null) {
        event.value = value;
      }
      this.push(event);
      return event;
    }

    push(event) {
      if (this.cache.length) {
        return _.last(this.cache).push(event);
      } else {
        return this.send(event);
      }
    }

    cache_up(event = null) {
      this.cache.push([]);
      if (event != null) {
        return this.add(event);
      }
    }

    cache_down(event = null) {
      var e, events, i, len1;
      events = this.cache.pop() || FAIL('cache_down');
      for (i = 0, len1 = events.length; i < len1; i++) {
        e = events[i];
        this.push(e);
      }
      if (event != null) {
        return this.add(event);
      }
    }

    cache_drop() {
      var events;
      events = this.cache.pop() || FAIL('cache_drop');
      return events;
    }

    cache_get(type) {
      var last;
      last = _.last(this.cache);
      return last && last[0] && last[0].type === type && last[0];
    }

    send(event) {
      return this.event.push(event);
    }

    output() {
      var output;
      output = this.event.map(function(e) {
        var value;
        value = (e.value != null ? e.value : '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\ $/g, '<SPC>');
        return e.type + (e.marker ? ` ${e.marker}` : '') + (e.anchor ? ` ${e.anchor}` : '') + (e.tag ? ` <${e.tag}>` : '') + (e.value ? ` ${value}` : '') + "\n";
      });
      return output.join('');
    }

    try__l_yaml_stream() {
      this.add('+STR');
      return this.tag_map = {};
    }

    got__l_yaml_stream() {
      return this.add('-STR');
    }

    got__c_tag_handle(o) {
      return this.tag_handle = o.text;
    }

    got__ns_tag_prefix(o) {
      return this.tag_map[this.tag_handle] = o.text;
    }

    try__l_bare_document() {
      var parser;
      parser = this.parser;
      if (parser.input.slice(parser.pos).match(/^(\s|\#.*\n?)*\S/)) {
        return this.add('+DOC');
      }
    }

    got__l_bare_document() {
      return this.cache_up('-DOC');
    }

    got__c_directives_end() {
      return this.marker = '---';
    }

    got__c_document_end() {
      var event;
      if (event = this.cache_get('-DOC')) {
        event.marker = '...';
        return this.cache_down();
      }
    }

    not__c_document_end() {
      if (this.cache_get('-DOC')) {
        return this.cache_down();
      }
    }

    got__c_flow_mapping__all__x7b() {
      return this.add('+MAP {}');
    }

    got__c_flow_mapping__all__x7d() {
      return this.add('-MAP');
    }

    got__c_flow_sequence__all__x5b() {
      return this.add('+SEQ []');
    }

    got__c_flow_sequence__all__x5d() {
      return this.add('-SEQ');
    }

    try__l_block_mapping() {
      return this.cache_up('+MAP');
    }

    got__l_block_mapping() {
      return this.cache_down('-MAP');
    }

    not__l_block_mapping() {
      return this.cache_drop();
    }

    try__l_block_sequence() {
      return this.cache_up('+SEQ');
    }

    got__l_block_sequence() {
      return this.cache_down('-SEQ');
    }

    not__l_block_sequence() {
      var event;
      event = this.cache_drop()[0];
      this.anchor = event.anchor;
      return this.tag = event.tag;
    }

    try__ns_l_compact_mapping() {
      return this.cache_up('+MAP');
    }

    got__ns_l_compact_mapping() {
      return this.cache_down('-MAP');
    }

    not__ns_l_compact_mapping() {
      return this.cache_drop();
    }

    try__ns_l_compact_sequence() {
      return this.cache_up('+SEQ');
    }

    got__ns_l_compact_sequence() {
      return this.cache_down('-SEQ');
    }

    not__ns_l_compact_sequence() {
      return this.cache_drop();
    }

    try__ns_flow_pair() {
      return this.cache_up('+MAP {}');
    }

    got__ns_flow_pair() {
      return this.cache_down('-MAP');
    }

    not__ns_flow_pair() {
      return this.cache_drop();
    }

    try__ns_l_block_map_implicit_entry() {
      return this.cache_up();
    }

    got__ns_l_block_map_implicit_entry() {
      return this.cache_down();
    }

    not__ns_l_block_map_implicit_entry() {
      return this.cache_drop();
    }

    try__c_l_block_map_explicit_entry() {
      return this.cache_up();
    }

    got__c_l_block_map_explicit_entry() {
      return this.cache_down();
    }

    not__c_l_block_map_explicit_entry() {
      return this.cache_drop();
    }

    not__s_l_block_collection__all__rep__all() {
      delete this.anchor;
      return delete this.tag;
    }

    try__c_ns_flow_map_empty_key_entry() {
      return this.cache_up();
    }

    got__c_ns_flow_map_empty_key_entry() {
      return FAIL('got__c_ns_flow_map_empty_key_entry');
    }

    not__c_ns_flow_map_empty_key_entry() {
      return this.cache_drop();
    }

    got__ns_plain(o) {
      var text;
      text = o.text.replace(/(?:[\ \t]*\r?\n[\ \t]*)/g, "\n").replace(/(\n)(\n*)/g, function(...m) {
        if (m[2].length) {
          return m[2];
        } else {
          return ' ';
        }
      });
      return this.add('=VAL', `:${text}`);
    }

    got__c_single_quoted(o) {
      var text;
      text = o.text.slice(1, -1).replace(/(?:[\ \t]*\r?\n[\ \t]*)/g, "\n").replace(/(\n)(\n*)/g, function(...m) {
        if (m[2].length) {
          return m[2];
        } else {
          return ' ';
        }
      }).replace(/''/g, "'");
      return this.add('=VAL', `'${text}`);
    }

    got__c_double_quoted(o) {
      var text;
      text = o.text.slice(1, -1).replace(/(?:[\ \t]*\r?\n[\ \t]*)/g, "\n").replace(/\\\n[\ \t]*/g, '').replace(/(\n)(\n*)/g, function(...m) {
        if (m[2].length) {
          return m[2];
        } else {
          return ' ';
        }
      }).replace(/\\(["\/])/g, "$1").replace(/\\ /g, ' ').replace(/\\t/g, "\t").replace(/\\n/g, "\n").replace(/\\\\/g, '\\');
      return this.add('=VAL', `\"${text}`);
    }

    got__l_empty() {
      if (this.in_scalar) {
        return this.add(null, '');
      }
    }

    got__l_nb_literal_text__all__rep2(o) {
      return this.add(null, o.text);
    }

    try__c_l_literal() {
      this.in_scalar = true;
      return this.cache_up();
    }

    got__c_l_literal() {
      var lines, t, text;
      delete this.in_scalar;
      lines = this.cache_drop();
      lines = lines.map(function(l) {
        return `${l.value}\n`;
      });
      text = lines.join('');
      t = this.parser.state_curr().t;
      if (t === 'clip') {
        text = text.replace(/\n+$/, "\n");
      } else if (t === 'strip') {
        text = text.replace(/\n+$/, "");
      }
      return this.add('=VAL', `|${text}`);
    }

    not__c_l_literal() {
      delete this.in_scalar;
      return this.cache_drop();
    }

    got__ns_char(o) {
      if (this.in_scalar) {
        return this.ns_char = o.text;
      }
    }

    got__s_nb_folded_text__all__rep(o) {
      return this.add(null, `${this.ns_char}${o.text}`);
    }

    try__c_l_folded() {
      this.in_scalar = true;
      return this.cache_up();
    }

    got__c_l_folded() {
      var lines, t, text;
      delete this.in_scalar;
      lines = this.cache_drop();
      lines = lines.map(function(l) {
        return `${l.value}\n`;
      });
      text = lines.join('');
      text = text.replace(/([^\n])(\n+)(?=.)/g, function(...m) {
        var len;
        len = m[2].length - 1;
        return m[1] + (len ? _.repeat("\n", len) : ' ');
      });
      t = this.parser.state_curr().t;
      if (t === 'clip') {
        text = text.replace(/\n+$/, "\n");
      } else if (t === 'strip') {
        text = text.replace(/\n+$/, "");
      }
      return this.add('=VAL', `>${text}`);
    }

    not__c_l_folded() {
      delete this.in_scalar;
      return this.cache_drop();
    }

    got__e_scalar() {
      return this.add('=VAL', ':');
    }

    got__c_ns_anchor_property(o) {
      return this.anchor = o.text;
    }

    got__c_ns_tag_property(o) {
      var m, prefix, tag;
      tag = o.text;
      if (m = tag.match(/^!!(.*)/)) {
        prefix = this.tag_map['!!'];
        if (prefix != null) {
          this.tag = prefix + tag.slice(2);
        } else {
          this.tag = `tag:yaml.org,2002:${m[1]}`;
        }
      } else if (m = tag.match(/^(!.*?!)/)) {
        prefix = this.tag_map[m[1]];
        if (prefix != null) {
          this.tag = prefix + tag.slice((m[1].length));
        }
      } else if ((prefix = this.tag_map['!']) != null) {
        this.tag = prefix + tag.slice(1);
      } else {
        this.tag = tag;
      }
      return this.tag = this.tag.replace(/%([0-9a-fA-F]{2})/g, function(...m) {
        return String.fromCharCode(parseInt(m[1], 16));
      });
    }

    got__c_ns_alias_node(o) {
      return this.add('=ALI', o.text);
    }

  };

  // vim: sw=2:

}).call(this);
