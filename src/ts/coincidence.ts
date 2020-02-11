var anchorStack: any = [];
var count: any = 0;
var echoFactor: any = 3;

var pattern: any = buildPattern(coincidence_theList);

var regexp: any = new RegExp(pattern, false ? "g" : "gi");

function buildPattern(list: any) {
    return '\\b(' + list.join('|') + ')\\b';
}

function wordCount(s: any) {
  return s.split(" ").length;
}

function wordCountGT(n: any) {
  return function(s: any) {
    return wordCount(s) > n;
  };
}

function echo(s: any, factor: any) {
  var left = "(".repeat(factor);
  var right = ")".repeat(factor);
  return left + s + right;
}

var walk = function(node: any) {
  // I stole this function from here:
  // http://is.gd/mwZp7E

  var next;
  var child = node.firstChild;

  if (node.nodeName === "A") {
    anchorStack.push(node.nodeName);
  }
  switch (node.nodeType) {
    case 1:
    case 9:
    case 11:
      while (child) {
        next = child.nextSibling;
        walk(child);
        child = next;
      }
      break;

    case 3:
      handleText(node);
      break;
  }
  if (node.nodeName === "A") {
    anchorStack.pop();
  }
};

var handleText = function(textNode: any) {
  count += 1;
  var v = textNode.nodeValue;
  v = v.replace(regexp, function(j: any) {
    count += 1;
    return echo(j, echoFactor);
  });
  v = v.replace(/\bIsrael\b/g, echo("Our Greatest Ally", echoFactor));
  textNode.nodeValue = v;
};

var observerOptions: any = { childList: true, subtree: true };
var timer: any;
var observer: any;

var mutationHandler = function(mutations: any) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    mutations.forEach((mutation: any) => {
      if (mutation.type != "childList") return;
      mutation.addedNodes.forEach(function(node: any) {
        if (node.nodeType != Node.ELEMENT_NODE) return;
        observer.disconnect();
        if (!node.isContentEditable) {
          walk(node);
        }
        observer.observe(document.body, observerOptions);
      });
    }, 500);
  });
};

observer = new MutationObserver(mutationHandler);
observer.observe(document.body, observerOptions);
walk(document.body);
