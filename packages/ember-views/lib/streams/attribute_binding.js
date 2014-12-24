/**
  Parse a path and return an object which holds the parsed properties.

  For example a path like "content.isEnabled:enabled:disabled" will return the
  following object:

  ```javascript
  {
    path: "content.isEnabled",
    className: "enabled",
    falsyClassName: "disabled",
    classNames: ":enabled:disabled"
  }
  ```

  @method parsePropertyPath
  @static
  @private
*/
export function parsePropertyPath(path) {
  var split = path.split(':');
  var propertyPath = split[0];
  var classNames = "";
  var className, falsyClassName;

  // check if the property is defined as prop:class or prop:trueClass:falseClass
  if (split.length > 1) {
    className = split[1];
    if (split.length === 3) {
      falsyClassName = split[2];
    }

    classNames = ':' + className;
    if (falsyClassName) {
      classNames += ":" + falsyClassName;
    }
  }

  return {
    path: propertyPath,
    classNames: classNames,
    className: (className === '') ? undefined : className,
    falsyClassName: falsyClassName
  };
}

function normalizeArguments(binding, prefix, attribute) {
  prefix = prefix || '';
  if (attribute === 'class') {
    Ember.assert("classNameBindings must not have spaces in them. Multiple class name bindings can be provided as elements of an array, e.g. ['foo', ':bar']", binding.indexOf(' ') === -1);
  } else {
     Ember.assert("attribute must not have spaces in them. Multiple class name bindings can be provided as elements of an array, e.g. ['foo', ':bar']", binding.indexOf(' ') === -1);
  }
}

export function streamifyClassNameBinding(view, classNameBinding, prefix) {
  normalizeArguments(classNameBinding, prefix, 'class');
  var parsedPath = parsePropertyPath(classNameBinding);
  if (parsedPath.path === '') {
    return classStringForValue(
      parsedPath.path,
      true,
      parsedPath.className,
      parsedPath.falsyClassName
    );
  } else {
    var pathValue = view.getStream(prefix+parsedPath.path);
    return chainStream(pathValue, function(){
      return classStringForValue(
        parsedPath.path,
        read(pathValue),
        parsedPath.className,
        parsedPath.falsyClassName
      );
    });
  }
}


export function streamifyAttributeBinding(view, binding, prefix) {

}