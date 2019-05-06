function init() {
    contentEl = document.getElementById("storyReader");
    if (!contentEl.classList.contains("is-spanified")) {
      contentEl.classList.add("is-spanified")
      setTimeout(() => getLeafNodes(contentEl), 1000);
    }
  }
  
  function getLeafNodes(node) {
    if (!node.hasChildNodes()) {
      // nodeType 3 indicates Text node
      if (node.nodeType === 3 && node.wholeText.trim() !== "") {
        var text = node.wholeText;
        var newNode = document.createElement("span");
        newNode.innerHTML = wrapWords(text);
        var parentNode = node.parentNode;
        // Bail out if already comment is attached
        if (parentNode.classList.contains("has_comments")) {
          return;
        }
        parentNode.insertBefore(newNode, node);
        parentNode.removeChild(node);
      }
      return;
    } else {
      node.childNodes.forEach(childNode => getLeafNodes(childNode));
    }
  }
  
  function wrapWords(str) {
    return str.replace(/(\S+\s*)/g, "<span>$&</span>");
  }
  