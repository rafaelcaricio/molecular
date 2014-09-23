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
  this.parseNodes(scope, this.template.getContent().childNodes[0]);
  return this.template.getContent();
};

InlineAnnotations.prototype.parseNodes = function(scope, rootNode) {
  if (!rootNode) {
    return;
  }

  if (rootNode.getAttribute) {
    for (var magicalAttribute in this.mapping) {
      var attrValue = rootNode.getAttribute(magicalAttribute);
      if (attrValue) {
        var mapSettings = this.mapping[magicalAttribute];
        this.template[mapSettings.method](scope, mapSettings.config(rootNode, attrValue));
      }
    }
  }

  this.parseNodes(scope, rootNode.nextElementSibling);
  for (var i = 0; i < rootNode.childNodes.length; i++) {
    this.parseNodes(scope, rootNode.childNodes[i]);
  }
};

module.exports = InlineAnnotations;
