export function toElements(data, root = "template") {
  const template = document.createElement(root);
  template.innerHTML = data;
  if (template instanceof HTMLTemplateElement) return template.content;
  return template;
}

export function toElement(data) {
  return toElements(data, "div");
}

export function elementRefs(fragments) {
  let children = fragments;
  if (fragments instanceof DocumentFragment) children = fragments.children;
  else if (fragments instanceof HTMLCollection) children = fragments;
  else if (fragments instanceof HTMLElement) children = [fragments];

  const elements = {};
  for (const element of children) {
    if (element.id) {
      elements[element.id] = element;
      // if (element.children)
      //   Object.assign(elements[element.id], {
      //     childref: elementRefs(element.children),
      //   });
    } else {
      if (element.children)
        Object.assign(elements, elementRefs(element.children));
    }
  }
  return elements;
}

export function uiInsert(parent, ...elements) {
  for (const element of elements) {
    if (element instanceof Node) parent.appendChild(element);
    else parent.appendChild(toElement(element));
  }
}

export function uiInsertBefore(element, ...elements) {
  const parent = element.parent;
  for (const replacement of elements) {
    if (element instanceof Node) parent.insertBefore(element, replacement);
    else parent.appendChild(element, toElement(replacement));
  }
}

export function uiInsertAfter(element, ...elements) {
  const parent = element.parent;
  for (const replacement of elements) {
    if (element instanceof Node) parent.insertAfter(element, replacement);
    else parent.insertAfter(element, toElement(replacement));
  }
}

export function uiDelete(element) {
  const { parentElement } = element;
  if (parentElement) {
    parentElement.removeChild(element);
  }
}

HTMLElement.prototype.insert = function(...elements) {
  uiInsert(this, ...elements);
};

HTMLElement.prototype.delete = function() {
  uiDelete(this);
};

HTMLElement.prototype.insertAfter = function(...elements) {
  uiInsertAfter(this, ...elements);
};

HTMLElement.prototype.insertBefore = function(...elements) {
  uiInsertBefore(this, ...elements);
};

HTMLElement.prototype.refs = function() {
  return elementRefs(this);
};

HTMLElement.prototype.replace = function(...replacements) {
  const parent = this.parentElement;
  if (parent) {
    uiInsertBefore(this, ...replacements);
    parent.removeChild(this);
  }
};

Number.prototype.toLengthOf = function(value) {
  return String(this).padStart(String(value).length, "0");
};

export function toList(...elements) {
  const list = [];
  for (const element of elements) {
    const li = document.createElement("li");
    li.insert(element);
    list.push(li);
  }
  return list;
}

export async function include(file) {
  const res = await fetch(file);
  return res.text();
}

export function stripScripts(nodes) {
  const scripts = [];

  for (const node of nodes.childNodes) {
    const { nodeType } = node;
    if (nodeType === 1 && node.tagName === "SCRIPT") {
      nodes.removeChild(node);
      scripts.push(node);
    }
  }
  return scripts;
}

export function stripStyles(nodes) {
  const styles = [];

  for (const node of nodes.childNodes) {
    const { nodeType } = node;
    if (nodeType === 1 && node.tagName === "STYLE") {
      nodes.removeChild(node);
      styles.push(node);
    } else if (
      nodeType === 1 &&
      node.tagName === "LINK" &&
      node.getAttribute("rel") === "stylesheet"
    ) {
      nodes.removeChild(node);
      styles.push(node);
    }
  }
  return styles;
}

export function cloneAttributes(nodeA, nodeB) {
  for (const attr of nodeA.attributes) {
    nodeB.setAttribute(attr.name, attr.value);
  }
}

export function loadScripts(scripts) {
  for (const script of scripts) {
    const newScript = document.createElement("script");
    cloneAttributes(script, newScript);
    newScript.innerText = script.innerText;
    document.head.appendChild(newScript);
  }
}

export function loadStyles(styles) {
  for (const style of styles) {
    if (style.tagName === "STYLE") {
      //TODO: handle style locale
      // const newStyle = document.createElement("style");
      // cloneAttributes(style, newStyle);
      // newStyle.innerText = style.innerText;
      document.head.appendChild(style);
    } else if (style.tagName === "LINK") {
      document.head.appendChild(style);
    }
  }
}
