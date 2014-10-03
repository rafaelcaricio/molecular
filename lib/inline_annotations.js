// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var InlineAnnotations = function(template) {
  this.mapping = {
    'ml-bind': {
      method: 'bindToContent',
      config: function(element, attrValue) {
        return {elements: [element], scopeKey: attrValue};
      }
    },
    'ml-model': {
      method: 'bindToValue',
      config: function(element, attrValue) {
        return {elements: [element], scopeKey: attrValue};
      }
    },
    'ml-style': {
      method: 'bindToStyle',
      config: function(element, attrValue) {
        return {elements: [element], expression: attrValue};
      }
    },
    'ml-show': {
      method: 'bindToVisible',
      config: function(element, attrValue) {
        return {elements: [element], expression: attrValue};
      }
    }
  };
  this.template = template;
};

InlineAnnotations.prototype.parse = function(scope) {
  this.parseNodes(scope, this.template.getContent());
  return this.template.getContent();
};

InlineAnnotations.prototype.parseNodes = function(scope, rootNode) {
  var walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_ELEMENT,
    function(node) { return NodeFilter.FILTER_ACCEPT; },
    true
  );

  while (walker.nextNode()) {
    for (var magicalAttribute in this.mapping) {
      var node = walker.currentNode,
          attrValue = node.getAttribute(magicalAttribute);

      if (!!attrValue) {
        var mapSettings = this.mapping[magicalAttribute];
        this.template[mapSettings.method](scope, mapSettings.config(node, attrValue));
      }
    }
  }
};

module.exports = InlineAnnotations;
