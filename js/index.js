let dataPersist = [];
let data = {};


function check() {
  
  data = {};
  storyPageEl = document.getElementById("storyReader");
  var bodyRect = document.body.getBoundingClientRect(),
    elemRect = storyPageEl.getBoundingClientRect(),
    offset   = elemRect.top - bodyRect.top;

console.log('Element is ' + offset + ' vertical pixels from <body>');
  console.log(bodyRect);
  console.log(elemRect);
  
  startIdx = document.getSelection().anchorNode.parentNode.attributes[
    "data-cue"
  ].value;
  endIdx = document.getSelection().focusNode.parentNode.attributes["data-cue"]
    .value;

  minIdx = Math.min(startIdx, endIdx);

  maxIdx = Math.max(startIdx, endIdx);

  data.startIdx = minIdx;
  data.endIdx = maxIdx;
  data.selected = [];
  for (let i = minIdx; i <= maxIdx; i++) {
    let cueEl = document.querySelector(`span[data-cue='${i}']`);
    
    if (cueEl) {
      data.selected.push(cueEl.innerHTML);
     cueEl.style.backgroundColor = "yellow";
    }
  }
  console.log(data);
  document.getElementById("popup__comments").innerHTML = `<pre>${JSON.stringify(
    data,
    null,
    2
  )}<pre>`;
  document.getElementById("popup").style.display = "block";
  document.getElementById("popup__input").value = "";
}

function submitComments() {
  var comment = document.getElementById("popup__input").value;
  document.getElementById("popup__input").value = "";

  data.comment = comment;
  dataPersist.push(data);
  for (let i = data.startIdx; i <= endIdx; i++) {
    let cueEl = document.querySelector(`span[data-cue='${i}']`);
    if (cueEl) {
     cueEl.style.backgroundColor = "#faeaea";
    }
  }
  document.getElementById("data-persist").innerHTML = `<pre>${JSON.stringify(
    dataPersist,
    null,
    2
  )}<pre>`;
}

// Listen to all clicks on the document
document.addEventListener(
  "mouseover",
  function(event) {
    // If the event target doesn't match bail
    if (!event.target.hasAttribute("data-cue")) return;
    currentIdx = event.target.attributes["data-cue"].value;
    // Otherwise, run your code...
    let comments = dataPersist.filter(data => currentIdx >= data.startIdx && currentIdx <= data.endIdx);
    console.log(comments);
    let commentsEl = comments.map(c => `<li>${c.comment}</li>`);
   console.log(commentsEl); document.getElementById("popup__comments").innerHTML = commentsEl.join("");
  },
  false
);