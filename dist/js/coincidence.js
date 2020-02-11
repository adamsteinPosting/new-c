"use strict";
var anchorStack = [];
var count = 0;
var echoFactor = 3;
var pattern = buildPattern(coincidence_theList);
var regexp = new RegExp(pattern, false ? "g" : "gi");
function buildPattern(list) {
    return '\\b(' + list.join('|') + ')\\b';
}
function wordCount(s) {
    return s.split(" ").length;
}
function wordCountGT(n) {
    return function (s) {
        return wordCount(s) > n;
    };
}
function echo(s, factor) {
    var left = "(".repeat(factor);
    var right = ")".repeat(factor);
    return left + s + right;
}
var walk = function (node) {
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
var handleText = function (textNode) {
    count += 1;
    var v = textNode.nodeValue;
    v = v.replace(regexp, function (j) {
        count += 1;
        return echo(j, echoFactor);
    });
    v = v.replace(/\bIsrael\b/g, echo("Our Greatest Ally", echoFactor));
    textNode.nodeValue = v;
};
var observerOptions = { childList: true, subtree: true };
var timer;
var observer;
var mutationHandler = function (mutations) {
    if (timer)
        clearTimeout(timer);
    timer = setTimeout(function () {
        mutations.forEach(function (mutation) {
            if (mutation.type != "childList")
                return;
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType != Node.ELEMENT_NODE)
                    return;
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
