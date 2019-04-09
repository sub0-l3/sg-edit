let dataPersist = [];
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

function getSelectionHtml() {
  var html = "";
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var container = document.createElement("div");
      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      html = container.innerHTML;
    }
  } else if (typeof document.selection != "undefined") {
    if (document.selection.type == "Text") {
      html = document.selection.createRange().htmlText;
    }
  }
  return html;
}

function handleMouseUp() {
  restoreSelectionStyling();
  let selection = getSelectedText();
  let selectedText = selection.toString();
  let selectedHTML = getSelectionHtml();
  let range = selection.getRangeAt(0);
  if (range.startContainer === range.endContainer) {
    let spanEl = document.createElement("SPAN");
    spanEl.textContent = selectedText;
    spanEl.setAttribute("class", "selected");
    spanEl.setAttribute("data-comment-attached", selectionState.selectedOnly);
    range.deleteContents();
    range.insertNode(spanEl);
  } else {
    let df = range.extractContents();
    let spanElsList = [];
    
    df.childNodes.forEach(node => {
      let spanEl = document.createElement("SPAN");
      
      if (node.nodeType == 3) {
        spanEl.textContent = node.textContent;
      } else {
        spanEl.innerHTML = node.innerHTML;
      }
      spanEl.setAttribute("class", "selected");
      spanEl.setAttribute("data-comment-attached", selectionState.selectedOnly);
      spanElsList.push(spanEl);
    });
    spanElsList.reverse().forEach(el => range.insertNode(el));
  }

  data = {};
  storyPageEl = document.getElementById("storyReader");

  renderData();
  document.getElementById("popup__input").value = "";
  document.getElementById("popup__input").focus();
}

function submitComments() {
  let comment = document.getElementById("popup__input").value;
  document.getElementById("popup__input").value = "";
  if (Object.keys(data).length === 0) return;
  comment_id += 1;
  data.id = comment_id;
  data.comment = comment;
  data.userId = currentUser.id;
  dataPersist.push(data);
  for (let i = data.startIdx; i <= data.endIdx; i++) {
    let cueEl = document.querySelector(`span[data-cue='${i}']`);
    if (cueEl) {
      cueEl.classList = "has_comments";
      selectedIdsWithOutComments.delete(i);
    }
  }
  data = new Object();
  renderData();

  document.getElementById("data-persist").innerHTML = `<pre>${JSON.stringify(
    dataPersist,
    null,
    2
  )}<pre>`;
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
    // If the event target doesn't match bail
    if (!event.target.hasAttribute("data-cue")) return;
    currentIdx = event.target.attributes["data-cue"].value;
    // Otherwise, run your code...
    let comments = dataPersist.filter(
      data => currentIdx >= data.startIdx && currentIdx <= data.endIdx
    );
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

// selectedIdsWithOutComments.forEach(i => {
//   let cueEl = document.querySelector(`span[data-comment-attached='1'`);
//   cueEl.classList = "";
// });
function restoreSelectionStyling() {
  // undoSpanWrap(el); TODO
  let elements = document.querySelectorAll(`[data-comment-attached='1']`);
  elements.forEach(el => {
    if (el) {
      el.classList = "";
      el.removeAttribute("data-comment-attached");
    }
    if (el) {
      var parent = el.parentNode;
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
      parent.normalize();
    }
  });

  selectedIdsWithComments.forEach(i => {
    // let cueEl = document.querySelector(`span[data-cue='${i}'`);
    // cueEl.classList = "has_comments";
  });
}
document.addEventListener("keypress", function(e) {
  if (e.which == 13) {
    submitComments();
  }
});

function highlightComment(el) {
  // console.log(el.attributes["data-comment"].value);
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
