// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


module.exports = {

  isArray: function(obj) {
    return obj.hasOwnProperty('length');
  },

  extendClass: function(xClass, proto) {
    var newClass = function() {}, attr;
    for (attr in xClass.prototype) {
      newClass.prototype[attr] = xClass.prototype[attr];
    }
    for (attr in proto) {
      newClass.prototype[attr] = proto[attr];
    }
    return newClass;
  }

};
