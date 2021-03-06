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

function handleMouseUp() {
  restoreSelectionStyling();
  data = {};
  storyPageEl = document.getElementById("storyReader");
  let bodyRect = document.body.getBoundingClientRect();
  // condition to handle case where selection starts from a space
  let anchorNode = document.getSelection().anchorNode,
    focusNode = document.getSelection().focusNode;
  let startIdx, endIdx;

  if (anchorNode.parentNode.attributes["data-cue"]) {
    startIdx = anchorNode.parentNode.attributes["data-cue"].value;
  } else if (
    anchorNode.nextSibling &&
    anchorNode.nextSibling.attributes["data-cue"]
  ) {
    startIdx = anchorNode.nextSibling.attributes["data-cue"].value;
  } else {
    return;
  }

  if (focusNode.parentNode.attributes["data-cue"]) {
    endIdx = focusNode.parentNode.attributes["data-cue"].value;
  } else if (
    focusNode.previousSibling &&
    focusNode.previousSibling.attributes["data-cue"]
  ) {
    endIdx = focusNode.previousSibling.attributes["data-cue"].value;
  } else {
    return;
  }

  let minIdx = Math.min(startIdx, endIdx);

  let maxIdx = Math.max(startIdx, endIdx);

  data.startIdx = minIdx;
  data.endIdx = maxIdx;
  data.selected = [];
  for (let i = minIdx; i <= maxIdx; i++) {
    let cueEl = document.querySelector(`span[data-cue='${i}']`);

    if (cueEl) {
      data.selected.push(cueEl.innerHTML);

      if (!cueEl.classList.contains("has_comments")) {
        selectedIdsWithOutComments.add(i);
      } else if (cueEl.classList.contains("has_comments")) {
        cueEl.classList.remove("has_comments");
        selectedIdsWithComments.add(i);
      }
      cueEl.classList.add("selected");
    }
  }
  // renderData();
  document.getElementById("popup__input").value = "";
  document.getElementById("popup__input").focus();
}

function submitComments() {
  var comment = document.getElementById("popup__input").value;
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
  // renderData();

  // document.getElementById("data-persist").innerHTML = `<pre>${JSON.stringify(
  //   dataPersist,
  //   null,
  //   2
  // )}<pre>`;
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
        <div class="sg-comment__content-title">${
          allUsers[c.userId - 1].first_name + " " +allUsers[c.userId - 1].last_name
        }</div>
        <div class="sg-comment__content-time">${getRandomInt(1,15)} days ago</div><div class="sg-comment__content-body">
        ${c.comment}</div></div></div>`
    );
    document.getElementById("popup__comments").innerHTML = commentsEl.join("");
  });

function restoreSelectionStyling() {
  selectedIdsWithOutComments.forEach(i => {
    let cueEl = document.querySelector(`span[data-cue='${i}'`);
    cueEl.classList = "";
  });
  selectedIdsWithComments.forEach(i => {
    let cueEl = document.querySelector(`span[data-cue='${i}'`);
    cueEl.classList = "has_comments";
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