
const listContainer = document.querySelector("[data-list]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");

const listDisplayContainer = document.querySelector("[data-list-display-container]");
const listTitleElement = document.querySelector("[data-list-title]");
const taskContainer = document.querySelector("[data-tasks]");
const listCountElement = document.querySelector("[data-list-count]");
const taskTemplate = document.querySelector("#task-template")
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const newTaskPriority = document.querySelector("[data-new-task-priority]");
const newTaskDate = document.querySelector("[data-new-task-date]");
const clearCompleteTasksButton = document.querySelector("[data-clear-complete-task-button]"); 

let modal = document.getElementById("modal-selector");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

const priorityStyleMap = {
    "Low": {
        background: "#aee1e1",
        fontColor: "#35495e"
    },
    "Normal": {
        background: "#fdc500",
        fontColor: "#654321"
    },
    "High": {
        background: "#dc0000",
        fontColor: "#f0f0f0"
    }
};

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "li") {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
})

taskContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "input") {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    }
})

document.addEventListener("click", e => {
    
    if (e.target.classList.contains("modify-task-button")) {
        modal.classList.add("visible");
        toggleBlur();
    }
});

theForm.addEventListener("submit", (e) => {
    e.preventDefault();
    modal.classList.remove("visible");
    theForm.reset();
    toggleBlur();
})

function toggleBlur() {
    var elements = document.body.children; 

    for (var i = 0; i < elements.length; i++) {
        if (!elements[i].classList.contains("modify-task-modal")) { 
            elements[i].classList.toggle("active"); 
        }
    }
}

clearCompleteTasksButton.addEventListener("click", e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
})


deleteListButton.addEventListener("click", e => {
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
})

newListForm.addEventListener("submit", e => {
    e.preventDefault();
    const listName = newListInput.value;
    if( listName == null || listName === "") return
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
})

newTaskForm.addEventListener("submit", e => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    const priorityNow = newTaskPriority.value;
    const taskDateNow = newTaskDate.value;
    if( taskName == null || taskName === "") return
    const task = createTask(taskName, priorityNow, taskDateNow);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task);
    saveAndRender();
})

function createList(name) {
    return { id: Date.now().toString(), 
        name: name, 
        tasks: [] 
    }
}

function createTask(name, priority, date) {
    return { id: Date.now().toString(), 
        name: name, 
        complete: false,
        priority: priority,
        date: date
    }
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function saveAndRender() {
    save();
    render();
}

function render () {
    clearElement(listContainer);
    renderLists();
    const selectedList = lists.find(list => list.id === selectedListId);
    
    if(selectedListId == null) {
        listDisplayContainer.style.display = "none";
        listTitleElement.innerText = "";
    } else {
        listDisplayContainer.style.display = "";
        listTitleElement.innerText = selectedList.name;
        resetDate();
        renderTaskCount(selectedList);
        clearElement(taskContainer);
        renderTasks(selectedList);
    }
}

function resetDate(){
    const today = new Date().toISOString().split('T')[0];
    newTaskDate.value = today;
}

function renderTasks(selectedList) {
   
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector("input");
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        label.append(task.name);
        
        const modifyTaskButton = taskElement.querySelector(".modify-task-button");
        modifyTaskButton.id = task.id;

        const priorityDiv = taskElement.querySelector(".priority-div");
        const dateDiv = taskElement.querySelector(".date-div");


        priorityDiv.textContent = task.priority;
        dateDiv.textContent = parseDate(task.date);

        taskContainer.appendChild(taskElement);
       
        const priorityValue = priorityDiv.textContent;
        const priorityStyle = priorityStyleMap[priorityValue];
       
        priorityDiv.style.background = priorityStyle.background;
        priorityDiv.style.color = priorityStyle.fontColor;
    })
}

function parseDate(date){

    const originalDate = new Date(date + 'T00:00:00');
    const timezoneOffset = originalDate.getTimezoneOffset() * 60000; 
    const adjustedDate = new Date(originalDate.getTime() + timezoneOffset);
    
    const day = adjustedDate.getDate();
    const month = adjustedDate.getMonth() + 1; 
    const year = adjustedDate.getFullYear();

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

    return formattedDate;
}

function renderTaskCount(selectedList){
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
    
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        if (list.id === selectedListId) {
            listElement.classList.add("active-option");
        }
        listContainer.appendChild(listElement);
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render();




