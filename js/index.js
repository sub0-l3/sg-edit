let dataPersist = [];
dataPersist.push({
  selected: "someone call",
  id: "tclej0ly8",
  comment: "a brief suggestion..",
  userId: 3
});
let data = {};
let selectedIdsWithOutComments = new Set();
let selectedIdsWithComments = new Set();
let comment_id = 0;
let allUsers = {};
let currentUser = {
  id: 1,
  first_name: "George",
  last_name: "Bluth",
  avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
};

const selectionState = {
  selectedOnly: 1,
  selectedAndCommented: 2
};

function getSelectedText() {
  t = document.all
    ? document.selection.createRange().text
    : document.getSelection();
  return t;
}

function handleMouseUp() {
  restoreSelectionStyling();
  let selection = getSelectedText();
  let range = selection.getRangeAt(0);
  if (selection.anchorNode === selection.focusNode) {
    range.startContainer.parentElement.classList.add("selected");
    return;
  }

  let startNode = range.startContainer;
  let endNode = range.endContainer;
  while ((startNode = getNextNode(startNode, false, endNode)));

  data = {};
  let selectedText = "";
  if (selection.anchorNode === selection.focusNode) {
    selectedText = selection.anchorNode.textContent;
  } else {
    selectedText = selection.toString();
  }
  data.selected = selectedText;

  renderData();
  document.getElementById("popup__input").value = "";
  document.getElementById("popup__input").focus();
}

function getNextNode(node, skipChildren, endNode) {
  if (
    node &&
    node.hasChildNodes() &&
    node.childNodes.length === 1 &&
    node.childNodes[0].nodeType === 3
  ) {
    node.classList.add("selected");
    console.log(node);
  }
  if (endNode == node) {
    return null;
  }
  //if there are child nodes and we didn't come from a child node
  if (node.firstChild && !skipChildren) {
    return node.firstChild;
  }
  if (!node.parentNode) {
    return null;
  }
  return node.nextSibling || getNextNode(node.parentNode, true, endNode);
}

function setSelectionOnLeafNodes(node) {
  if (node.hasChildNodes()) {
    node.childNodes.forEach(childNode => setSelectionOnLeafNodes(childNode));
  } else {
    console.log(node);
    node.parentElement && node.parentElement.classList.add("selected");
    return;
  }
}

function submitComments() {
  let comment = document.getElementById("popup__input").value;
  document.getElementById("popup__input").value = "";
  randomClassName = generateRandomHex();
  document.querySelectorAll(".selected").forEach(el => {
    el.classList.remove("selected");
    el.classList.add("has_comments");
    el.classList.toString();
    el.classList.add(randomClassName);
    el.setAttribute(
      "data-comment-attached",
      selectionState.selectedAndCommented
    );
  });
  data.id = randomClassName;
  data.comment = comment;
  data.userId = currentUser.id;
  dataPersist.push(data);
  data = new Object();
  renderData();

  document.getElementById("data-persist").innerHTML = `<pre>${JSON.stringify(
    dataPersist,
    null,
    2
  )}<pre>`;
}

// Ref. https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function generateRandomHex() {
  return Math.random()
    .toString(36)
    .substring(3);
}

function renderData() {
  document.getElementById("popup__data").innerHTML = `<pre>${JSON.stringify(
    data,
    null,
    2
  )}<pre>`;
}

// Listen to all mouseover events on the document
document
  .getElementById("storyReader")
  .addEventListener("mouseover", function(event) {
    let commentIDList = [];
    // If the event target doesn't match bail
    // console.log(event.target)
    if (!event.target.classList.contains("has_comments")) return;
    commentIDList = Array.from(event.target.classList);
    // Otherwise, run your code...
    let comments = dataPersist.filter(data => commentIDList.includes(data.id));
    let commentsEl = comments.map(
      c =>
        `<div class="sg-comment" data-comment=${
          c.id
        } onmouseover="highlightComment(this)" onmouseout="unHighlightComment(this)">
        <div class="sg-comment__img-wrapper">
        <img src="${allUsers[c.userId - 1].avatar}" class="sg-comment__img">
        </div>
        <div class="sg-comment__content">
        <div class="sg-comment__content-title">${allUsers[c.userId - 1]
          .first_name +
          " " +
          allUsers[c.userId - 1].last_name}</div>
        <div class="sg-comment__content-time">${getRandomInt(
          1,
          15
        )} days ago</div><div class="sg-comment__content-body">
        ${c.comment}</div></div></div>`
    );
    document.getElementById("popup__comments").innerHTML = commentsEl.join("");
  });

function restoreSelectionStyling() {
  document.querySelectorAll(".selected").forEach(el => {
    el.classList.remove("selected");
    el.removeAttribute("data-comment-attached");
  });
}
document.addEventListener("keypress", function(e) {
  if (e.which == 13) {
    submitComments();
  }
});

function highlightComment(el) {
  let commentIdx = el.attributes["data-comment"].value;
  comment = dataPersist.find(data => data.id == commentIdx);
  for (let i = comment.startIdx; i <= comment.endIdx; i++) {
    let cueEl = document.querySelector(`span[data-cue='${i}'`);
    cueEl.classList.add("highlight-comment");
  }
}

function unHighlightComment(el) {
  let commentIdx = el.attributes["data-comment"].value;
  comment = dataPersist.find(data => data.id == commentIdx);
  for (let i = comment.startIdx; i <= comment.endIdx; i++) {
    let cueEl = document.querySelector(`span[data-cue='${i}'`);
    cueEl.classList.remove("highlight-comment");
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
