// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var Utils = require('./utils');


var TemplateRender = function(selector) {
  if (selector) {
    this.selector = selector;
  }
};

TemplateRender.prototype.getContent = function() {
  if (!this.content) {
    var template = document.querySelector(this.selector);
    this.content = template.cloneNode(true).content;
    this.content = document.importNode(this.content, true);
  }
  return this.content;
};

TemplateRender.prototype.render = function(scope) {
  this.getContent();
  if (this.bindData) {
    this.bindData(scope);
  }
  return this.content;
};

TemplateRender.prototype.$ = function(selector) {
  return this.content.querySelectorAll(selector);
};

TemplateRender.prototype.bindToContent = function(scope, config) {
  var applyValueToElement = function(scope, element) {
    element.innerHTML = scope[config.scopeKey];
  };
  this._bindToElement(scope, config, {
    initialState: applyValueToElement,
    changesFromScope: applyValueToElement,
    listenChangesFromElement: function(scope, element) {
    }
  });
};

TemplateRender.prototype.bindToValue = function(scope, config) {
  var applyValueToElement = function(scope, element) {
    element.value = scope[config.scopeKey];
  };
  this._bindToElement(scope, config, {
    initialState: applyValueToElement,
    changesFromScope: applyValueToElement,
    listenChangesFromElement: function(scope, element) {
      element.addEventListener('keyup', function(ev) {
        scope[config.scopeKey] = element.value;
      });
    }
  });
};

TemplateRender.prototype.bindToDOM = function(scope, config) {
  var elements = config.elements;

  var watchArrayChanges = function(scope) {
    var internalValue = scope[config.scopeKey];
    if (Utils.isArray(internalValue)) {
      Object.observe(internalValue, function() {
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          element.innerHTML = '';
          config.onChange(scope, element);
        }
      });
    }
  }, self = this;

  this._bindToElement(scope, config, {
    initialState: function(scope, element) {
      element.innerHTML = '';
      config.onChange(scope, element);
      watchArrayChanges.bind(self)(scope);
    },
    changesFromScope: function(scope, element) {
      element.innerHTML = '';
      config.onChange(scope, element);
      watchArrayChanges.bind(self)(scope);
    },
    listenChangesFromElement: function(scope, element) {
      // do nothing
    }
  });
};

TemplateRender.prototype.executeInScope = function(scope, expr) {
  return (function(scope) {
    return eval("(function a(){with(scope){return(" + expr + ")}})()");
  })(scope);
};

TemplateRender.prototype.bindToStyle = function(scope, config) {
  var applyStyle = function(scope, element) {
    var newStyles = this.executeInScope(scope, config.expression);
    for (var key in newStyles) {
      element.style[key] = newStyles[key];
    }
  }.bind(this);
  this._bindToElement(scope, config, {
    initialState: applyStyle,
    changesFromScope: applyStyle,
    listenChangesFromElement: function(scope, element) {
      // do nothing
    }
  });
};

TemplateRender.prototype.bindToVisible = function(scope, config) {
  var toggle = function(scope, element) {
    if (this.executeInScope(scope, config.expression)) {
      element.style.visibility = 'visible';
    } else {
      element.style.visibility = 'hidden';
    }
  }.bind(this);
  this._bindToElement(scope, config, {
    initialState: function(scope, element) {
      toggle(scope, element);
    },
    changesFromScope: function(scope, element) {
      toggle(scope, element);
    },
    listenChangesFromElement: function(scope, element) {
      // do nothing
    }
  });
};

TemplateRender.prototype.bindForEach = function(scope, config) {
  this.bindToDOM(scope, {elements: config.container, scopeKey: config.scopeKey, onChange: function(scope, element) {
    for (var i = 0; i < scope[config.scopeKey].length; i++) {
      var content = (new config.template()).render(scope.layers[i]);
      element.appendChild(content);
    }
  }});
};

TemplateRender.prototype._bindToElement = function(scope, config, events) {
  var elements = config.elements;
  Object.observe(scope, function(changes) {
    changes.forEach(function(change) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (config.scopeKey) {
          // execute local changes in a variable in the scope
          if (change.name == config.scopeKey) {
            events.changesFromScope(scope, element);
          }
        } else if (config.expression) {
          // execute global changes in the scope
          events.changesFromScope(scope, element);
        }
      }
    });
  });

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    events.listenChangesFromElement(scope, element);
    events.initialState(scope, element);
  }
};

module.exports = TemplateRender;
