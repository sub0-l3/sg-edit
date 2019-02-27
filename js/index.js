let dataPersist = [];
let data = {};
let selectedIds = new Set();

function handleMouseUp() {
  restoreSelectionStyling();
  data = {};
  storyPageEl = document.getElementById("storyReader");
  let bodyRect = document.body.getBoundingClientRect();
  // condition to handle case where selection starts from a space
  let anchorNode = document.getSelection().anchorNode,
    focusNode = document.getSelection().focusNode;
  let startIdx = anchorNode.parentNode.attributes["data-cue"]
    ? anchorNode.parentNode.attributes["data-cue"].value
    : anchorNode.nextSibling.attributes["data-cue"].value;

  let endIdx = focusNode.parentNode.attributes["data-cue"]
    ? focusNode.parentNode.attributes["data-cue"].value
    : focusNode.previousSibling.attributes["data-cue"].value;

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
        selectedIds.add(i);
        cueEl.classList.add("selected");
      }

      elemRect = cueEl.getBoundingClientRect();
      offset = elemRect.top - bodyRect.top;
      console.log("Element is " + offset + " vertical pixels from <body>");
    }
  }
  renderData();
  document.getElementById("popup__input").value = "";
  document.getElementById("popup__input").focus();
}

function submitComments() {
  var comment = document.getElementById("popup__input").value;
  document.getElementById("popup__input").value = "";
  if (Object.keys(data).length === 0) return;
  data.comment = comment;
  dataPersist.push(data);
  for (let i = data.startIdx; i <= data.endIdx; i++) {
    let cueEl = document.querySelector(`span[data-cue='${i}']`);
    if (cueEl) {
      cueEl.classList = "has_comments";
      selectedIds.delete(i);
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
document.addEventListener("mouseover", function(event) {
  // If the event target doesn't match bail
  if (!event.target.hasAttribute("data-cue")) return;
  currentIdx = event.target.attributes["data-cue"].value;
  // Otherwise, run your code...
  let comments = dataPersist.filter(
    data => currentIdx >= data.startIdx && currentIdx <= data.endIdx
  );
  let commentsEl = comments.map(c => `<li>${c.comment}</li>`);
  document.getElementById("popup__comments").innerHTML = commentsEl.join("");
});

function restoreSelectionStyling() {
  selectedIds.forEach(i => {
    let cueEl = document.querySelector(`span[data-cue='${i}'`);
    cueEl.classList = "";
  });
}
document.addEventListener("keypress", function(e) {
  if (e.which == 13) {
    submitComments();
  }
});
// document.addEventListener("click", restoreSelectionStyling);
