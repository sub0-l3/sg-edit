let dataPersist = [];
let data = {};

function handleMouseUp() {
  data = {};
  storyPageEl = document.getElementById("storyReader");
  let bodyRect = document.body.getBoundingClientRect();
  // condition to handle case where selection starts from a space
  let anchorNode = document.getSelection().anchorNode,
    focusNode = document.getSelection().focusNode;
  let startIdx = anchorNode.parentNode.attributes["data-cue"]
    ? anchorNode.parentNode.attributes["data-cue"].value
    : anchorNode.nextSibling.attributes["data-cue"].value;

  endIdx = focusNode.parentNode.attributes["data-cue"]
    ? focusNode.parentNode.attributes["data-cue"].value
    : focusNode.previousSibling.attributes["data-cue"].value;

  minIdx = Math.min(startIdx, endIdx);

  maxIdx = Math.max(startIdx, endIdx);

  data.startIdx = minIdx;
  data.endIdx = maxIdx;
  data.selected = [];
  for (let i = minIdx; i <= maxIdx; i++) {
    let cueEl = document.querySelector(`span[data-cue='${i}']`);

    if (cueEl) {
      data.selected.push(cueEl.innerHTML);
      cueEl.classList.add("selected");
      elemRect = cueEl.getBoundingClientRect();
      offset = elemRect.top - bodyRect.top;
      console.log("Element is " + offset + " vertical pixels from <body>");
    }
  }
  document.getElementById("popup__data").innerHTML = `<pre>${JSON.stringify(
    data,
    null,
    2
  )}<pre>`;
  document.getElementById("popup__input").value = "";
  // document.getElementById("popup__input").focus();
}

function submitComments() {
  var comment = document.getElementById("popup__input").value;
  document.getElementById("popup__input").value = "";
  if (Object.keys(data).length === 0) return;
  data.comment = comment;
  dataPersist.push(data);
  for (let i = data.startIdx; i <= endIdx; i++) {
    let cueEl = document.querySelector(`span[data-cue='${i}']`);
    if (cueEl) {
      cueEl.classList = "has_comments";
    }
  }
  data = {};
  document.getElementById("data-persist").innerHTML = `<pre>${JSON.stringify(
    dataPersist,
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
