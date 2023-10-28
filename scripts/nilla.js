export function toElements(data, root = "template") {
  let template;
  if (root instanceof HTMLElement) {
    template = root;
  } else if (typeof root === "string") {
    template = document.createElement(root);
  } else {
    throw new Error("Unhandle root element");
  }
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

/**
 * @param {HTMLElement} element
 * */
export function uiInsertBefore(element, ...elements) {
  const parent = element.parentElement;
  for (const replacement of elements) {
    if (element instanceof Node) parent.insertBefore(replacement, element);
    else parent.insertBefore(toElement(replacement), element);
  }
}

export function uiInsertAfter(element, ...elements) {
  const parent = element.parentElement;
  for (const replacement of elements) {
    if (element instanceof Node) parent.insertAfter(replacement, element);
    else parent.insertAfter(toElement(replacement), element);
  }
}

export function uiDelete(element) {
  const { parentElement } = element;
  if (parentElement) {
    parentElement.removeChild(element);
  }
}

export function uiClear(element) {
  element.innerHTML = "";
}

HTMLElement.prototype.clear = function () {
  uiClear(this);
};

HTMLElement.prototype.insert = function (...elements) {
  uiInsert(this, ...elements);
};

HTMLElement.prototype.delete = function () {
  if (this.parentElement) {
    uiDelete(this);
  } else {
    throw new Error("Cannot delete children that has no parent");
  }
};

HTMLElement.prototype.insertAfterMe = function (...elements) {
  uiInsertAfter(this, ...elements);
};

HTMLElement.prototype.insertBeforeMe = function (...elements) {
  uiInsertBefore(this, ...elements);
};

HTMLElement.prototype.refs = function () {
  return elementRefs(this);
};

DocumentFragment.prototype.replace = function (child, ...replacements) {
  if (replacements.length > 1) {
    const group = document.createElement("div");
    group.insert(...replacements);
    this.replaceChild(group, child);
  } else if (replacements.length === 1) {
    this.replaceChild(replacements[0], child);
  } else {
    throw new Error("Trying to replace child with nothing");
  }
};

HTMLElement.prototype.replace = function (...replacements) {
  const parent = this.parentElement;
  if (parent) {
    uiInsertBefore(this, ...replacements);
    parent.removeChild(this);
  }
};

Number.prototype.toLengthOf = function (value) {
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

export async function require(file) {
  const res = await fetch(file);
  return res.text();
}

export async function include(file) {
  //TODO: clean node childs that have no meaning
  const data = await require(file);

  const elements = toElements(data);
  const scripts = stripScripts(elements);
  const styles = stripStyles(elements);

  return { elements, scripts, styles };
}

export async function replaceIncludes(root) {
  const includes = stripIncludes(root);
  const scripts = [];
  const styles = [];

  for (const inc of includes) {
    const {
      elements: els,
      scripts: sc,
      styles: sty,
    } = await include(inc.getAttribute("include"));

    if (els instanceof DocumentFragment) {
      const incGroup = document.createElement("div");
      cloneAttributes(inc, incGroup);
      incGroup.insert(els);
      inc.replace(incGroup);
    } else {
      inc.replace(els);
    }

    scripts.push(...sc);
    styles.push(...sty);
  }

  for (const child of root.childNodes) {
    await replaceIncludes(child);
  }

  return { scripts, styles };
}

export function stripIncludes(root) {
  const includes = [];
  if (!("childNodes" in root)) throw new Error("Invalid root for strippin");

  for (const node of root.childNodes) {
    const { nodeType } = node;
    if (
      nodeType === 1 &&
      node.tagName === "LINK" &&
      node.getAttribute("include") !== null
    ) {
      includes.push(node);
    }
  }

  return includes;
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
