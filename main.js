let txt = document.getElementById("txt");
let tasks = [];
let idx;
let mode = 'add';
let count = 0;

window.onload = function () {
  loadfromstorage();
  showtasks();
}

function loadfromstorage() {
  try {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) tasks = JSON.parse(storedTasks);
  } catch (e) {
    tasks = [];
  }
}

function uploadtostorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showtasks() {
  let list = document.getElementById("list");
  list.innerHTML = "";
  count = 0;

  for (let i = 0; i < tasks.length; i++) {
    let newitem = document.createElement("li");
    newitem.innerHTML = `
      <input type="checkbox" ${tasks[i].completed ? 'checked' : ''}>
      <p>${tasks[i].name}</p>
      <button onclick="edit(${i})" id="edit"><img src="Images/edit.png"></button>
      <button onclick="delet(${i})" id="delet"><img src="Images/bin.png"></button>
    `;
    if (tasks[i].completed) {
      newitem.querySelector("p").style.textDecoration = "line-through";
      count++;
    }
    newitem.querySelector('input[type="checkbox"]').addEventListener('change', function () {
      toggleComplete(i);
    });
    list.appendChild(newitem);
  }

  editstats();
}

function addtask() {
  if (txt.value.trim() == '') {
    window.alert("Please Enter A valid Task")
  } else {
    if (mode === 'add') {
      tasks.push({ name: txt.value, completed: false });
    } else {
      tasks[idx].name = txt.value.trim();
      mode = 'add';
    }
    txt.value = '';
    showtasks();
    uploadtostorage();
  }
}

function delet(i) {
  tasks.splice(i, 1);
  showtasks();
  uploadtostorage();
}

function edit(i) {
  txt.value = tasks[i].name;
  idx = i;
  mode = 'edit';
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function editstats() {
  document.getElementById("number").innerHTML = `${count}/${tasks.length}`;
  document.getElementById("progress").style.width = (tasks.length ? (100 * (count / tasks.length)) : 0) + "%";
  if (count == tasks.length && tasks.length > 0) {
    celebrate();
  }
}

function toggleComplete(i) {
  tasks[i].completed = !tasks[i].completed;
  const p = document.querySelectorAll("#list li p")[i];
  p.style.textDecoration = tasks[i].completed ? "line-through" : "none";
  uploadtostorage();
  count = tasks.filter(t => t.completed).length;
  editstats();
}

function celebrate() {
  const count = 200,
    defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}
