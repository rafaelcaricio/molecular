Molecular
=========

Light-weight bidirectional data binding rendering for HTML5 templates. Currently this library has been a playground for new ideas and a way to understand how other frameworks work. If you liked it and want to contribute I would be happy to hear from you or accept your pull request.

Getting started
---------------

You can use molecular in two ways, you can extend the `TemplateRender` class and bind the observers in your template manually or you can tag your code with personalized attributes and initialize the `InlineAnnotations` class that will take care of binding your data to the template.

First you need to define your template code using the `template` HTML5 tag and give it an `id`.

```html
<template id="article-templ">
  <article>
    <h1></h1>
    <p></p>
  </article>
</template>
```

The `scope` object is a simple javascript object. Let's take the `scope` defined bellow to use in our examples.

```javascript
var scope = {
  title: 'A simple title for this article',
  content: 'A very interesting content for this article.'
};
```

### Using the `TemplateRender` class

You need to extend the `TemplateRender` class and implement the method `bindData` to attach the values from the `scope` to each desired DOM element in your template.

```javascript
var molecular = require('molecular'),
    TemplateRender = molecular.TemplateRender,
    extendClass = require('molecular').extendClass;

var ArticleTemplateRender = extendClass(TemplateRender, {
  selector: '#article-templ',
  bindData: function(scope) {
    this.bindToContent(scope, {elements: this.$('h1'), scopeKey: 'title'});
    this.bindToContent(scope, {elements: this.$('p'), scopeKey: 'content'});
  }
});
```

After you implemented the bindings you can use your new class `ArticleTemplateRender` to attach a `scope` and then add the rendered DOM object to your page document.

```javascript
var articleRender = new ArticleTemplateRender();
var htmlDOMFragment = articleRender.render(scope);
```

The `render` method will return a DOM fragment that can be attached to any element in your page, just fetch it and append the rendered result as child node.

```javascript
document.querySelector('#target').appendChild(htmlDOMFragment);
```

