// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var TestLayerTemplateRender = extendClass(TemplateRender, {
  selector: '#layer-templ',
  bindData: function(scope) {
    this.bindToContent(scope, {elements: this.$('label'), scopeKey: 'title'});
    this.bindToContent(scope, {elements: this.$('small'), scopeKey: 'content'});
  }
});

var TestGradientTemplateRender = extendClass(TemplateRender, {
  selector: '#grad-templ',
  bindData: function(scope) {

    this.bindToContent(scope, {elements: this.$('label'), scopeKey: 'name'});

    this.bindToValue(scope, {elements: this.$('#input1'), scopeKey: 'name'});
    this.bindToValue(scope, {elements: this.$('#input2'), scopeKey: 'name'});

    this.bindToStyle(scope, {elements: this.$('.text'), expression: "{'color': color}"});

    this.bindToVisible(scope, {elements: this.$('.dwa'), expression: "name == 'show it!'"});

    this.bindForEach(scope, {container: this.$('#layers'), scopeKey: 'layers', template: TestLayerTemplateRender});

  }
});


var sampleContext = {
  name: 'Rafael',
  color: 'red',
  layers: [
    {title: 'First', content: 'something'},
    {title: 'Second', content: 'another thing'}
  ]
};

function main() {
  //document.querySelector('#cont').appendChild((new TestGradientTemplateRender()).render(sampleContext));

  var inlineParser = new InlineAnnotations(new TemplateRender('#grad-templ'));
  var result = inlineParser.parse(sampleContext);
  document.querySelector('#cont').appendChild(result);
}
