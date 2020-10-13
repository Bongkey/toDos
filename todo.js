const writeForm = document.querySelector(".write-form");
const writer = document.querySelector("#writer");
const pending = document.querySelector(".pending");
const finished = document.querySelector(".finished");

let pendingList = [];
let finishedList = [];

const PENDING_LS = "pendingList";
const FINISHED_LS = "finishedList";

function handleSubmit(event) {
  event.preventDefault();
  const currentText = writer.value;
  addToDo(currentText, pending, pendingList);
  writer.value = "";
}

function addToDo(text, ul, array) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const chkBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = pendingList.length + finishedList.length + 1;
  const ulName = ul.classList.value;
  chkBtn.innerText = ulName === "pending" ? "✅" : "⏪";
  chkBtn.addEventListener("click", checkToDo);
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteToDo);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(chkBtn);
  li.id = newId;
  ul.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId
  };
  array.push(toDoObj);
  saveToDos();
}

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const ul = li.parentNode;
  const ulName = li.parentNode.classList.value;

  ul.removeChild(li);
  if (ulName === "pending") {
    pendingList = deleteListItem(li, pendingList);
  } else {
    finishedList = deleteListItem(li, finishedList);
  }
  saveToDos();
}

function deleteListItem(li, array) {
  const cleanToDos = array.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  return cleanToDos;
}

function addListItem(li, firArray, secArray) {
  const ToDo = firArray.forEach(function (toDo) {
    if (toDo.id === parseInt(li.id)) {
      secArray.push(toDo);
    }
  });
}

function checkToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const ulName = li.parentNode.classList.value;
  if (ulName === "pending") {
    finished.appendChild(li);
    addListItem(li, pendingList, finishedList);
    pendingList = deleteListItem(li, pendingList);
    li.lastChild.innerText = "⏪";
  } else {
    pending.appendChild(li);
    addListItem(li, finishedList, pendingList);
    finishedList = deleteListItem(li, finishedList);
    li.lastChild.innerText = "✅";
  }
  console.log(pendingList, finishedList);
  saveToDos();
}

function saveToDos() {
  localStorage.setItem(PENDING_LS, JSON.stringify(pendingList));
  localStorage.setItem(FINISHED_LS, JSON.stringify(finishedList));
}

function loadToDos() {
  const loadedPending = localStorage.getItem(PENDING_LS);
  const loadedFinishing = localStorage.getItem(FINISHED_LS);
  reWrite(loadedPending, pending, pendingList);
  reWrite(loadedFinishing, finished, finishedList);
}

function reWrite(loaded, ul, array) {
  if (loaded !== null) {
    const parsedToDos = JSON.parse(loaded);
    parsedToDos.forEach(function (toDo) {
      addToDo(toDo.text, ul, array);
    });
  }
}

function init() {
  loadToDos();
  writeForm.addEventListener("submit", handleSubmit);
}

init();
