
const listContainer = document.querySelector("[data-list]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");

let lists = [
    {
        id:1,
        name: "Trabas"
    },{ 
        id: 2,
        name: "Sexoservidoras"
    }];

newListForm.addEventListener("submit", e => {
    e.preventDefault();
    const listName = newListInput.value;
    if( listName == null || listName === "") return
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    render();
})

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function render () {
    clearElement(listContainer);
    lists.forEach(list => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        listContainer.appendChild(listElement);
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render();