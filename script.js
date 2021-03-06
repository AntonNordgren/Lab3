
var config = {
    apiKey: "AIzaSyDNOB-Yx4HR_sYPlYrO6nl2QHlB-nwOWs8",
    authDomain: "lab3-181e3.firebaseapp.com",
    databaseURL: "https://lab3-181e3.firebaseio.com",
    projectId: "lab3-181e3",
    storageBucket: "lab3-181e3.appspot.com",
    messagingSenderId: "1054177454395"
};

firebase.initializeApp(config);
const database = firebase.database();

let addButton        = document.getElementById('addButton');
let titleInput       = document.getElementById("title");
let directorInput    = document.getElementById("director");
let yearInput        = document.getElementById("year");
let listDisplay      = document.getElementById("listDisplay");
let theList          = document.getElementById("theList");
let sortTitleBtn     = document.getElementById("sortTitleBtn");
let sortDirectorBtn  = document.getElementById("sortDirectorBtn");
let sortYearButton   = document.getElementById("sortYearBtn");
let nextBtn          = document.getElementById("nextBtn");
let prevBtn          = document.getElementById("prevBtn");
let ascendBtn        = document.getElementById("ascendBtn");
let descendBtn       = document.getElementById("descendBtn");
let sortByBtn        = document.getElementById("sortByBtn");

let currentPage = 0;
let lastPage = 0;
let sortByChild = "title";
let ascendOrder = true;
let searchValue = "";

let listOfMovies = [];

let selectedButtonColor = "#3a1907";

sortTitleBtn.disabled = true;
sortDirectorBtn.disabled = false;
sortYearBtn.disabled = false;
sortTitleBtn.style.backgroundColor = selectedButtonColor;
sortDirectorBtn.style.backgroundColor = "#d80a48";
sortYearBtn.style.backgroundColor = "#d80a48";


addButton.addEventListener('click', function() {
    let title    = titleInput.value;
    let director = directorInput.value;
    let year     = yearInput.value;
    
    if(title === "" || director === "" || year === ""){
        console.log("Please enter all inputs");
    }
    else {
        let newMovie = {
            title : title,
            director : director,
            year : year
        };
        
        database.ref('/').push(newMovie);
    }
});

database.ref('/').on('value', function(data) {
    addToArray(data);
    updateList();
});

sortTitleBtn.addEventListener('click', function() {
    sortBy('title');
    sortTitleBtn.disabled = true;

    sortDirectorBtn.disabled = false;
    sortYearBtn.disabled = false;
    sortTitleBtn.style.backgroundColor = selectedButtonColor;

    sortDirectorBtn.style.backgroundColor = "#d80a48";
    sortYearBtn.style.backgroundColor = "#d80a48";
});


sortDirectorBtn.addEventListener('click', function() {
    sortBy('director');
    sortDirectorBtn.disabled = true;

    sortTitleBtn.disabled = false;
    sortYearBtn.disabled = false;
    sortDirectorBtn.style.backgroundColor = selectedButtonColor;

    sortTitleBtn.style.backgroundColor = "#d80a48";
    sortYearBtn.style.backgroundColor = "#d80a48";
});

sortYearBtn.addEventListener('click', function() {
    sortBy('year');
    sortYearBtn.disabled = true;

    sortTitleBtn.disabled = false;
    sortDirectorBtn.disabled = false;
    sortYearBtn.style.backgroundColor = selectedButtonColor;

    sortTitleBtn.style.backgroundColor = "#d80a48";
    sortDirectorBtn.style.backgroundColor = "#d80a48";
});

searchBtn.addEventListener('click', function(){
    searchValue = searchInput.value.toUpperCase();
    clearTheList();
    addAllToList(listOfMovies);
});

function sortBy(value) {
    currentPage = 0;
    sortByChild = value;
    updateList();
}

function sortThelist() {
    listOfMovies.sort((a, b) => a[sortByChild].toLowerCase() > b[sortByChild].toLowerCase());
}

function updateList() {
    clearTheList();
    sortThelist();
    addAllToList(listOfMovies);
}

function addToArray(data) {
    listOfMovies = [];
    data.forEach(entry => {
        let movie = {
            title : entry.val().title,
            director : entry.val().director,
            year : entry.val().year,
            key : entry.key
        }
        listOfMovies.push(movie);
    });
}

function addAllToList(listOfMovies) {
    if(listOfMovies !== null) {
        if(!searchValue == ""){
            listOfMovies = listOfMovies.filter( child =>
                child.title.toUpperCase().includes(searchValue) ||
                child.director.toUpperCase().includes(searchValue) ||
                child.year.toUpperCase().includes(searchValue));
        }
        
        lastPage = Math.ceil(listOfMovies.length / 5);
        let startAt = currentPage * 5;
        let endAt = startAt + 5;
        for(let i = startAt; i < endAt && i < listOfMovies.length; i++) {
            addToList(listOfMovies[i]);
        }
    }
}

nextBtn.addEventListener('click', function() {
    if(currentPage + 1 < lastPage){
        currentPage++;
        clearTheList();
        addAllToList(listOfMovies);
    }
});

prevBtn.addEventListener('click', function() {
    if(currentPage !== 0) {
        currentPage--;
        clearTheList();
        addAllToList(listOfMovies);
    }
});

sortByBtn.addEventListener('click', function() {
    listOfMovies.reverse();
    clearTheList();
    addAllToList(listOfMovies);
});

function addToList(child) {
    let title = child.title;
    let director = child.director;
    let year = child.year;
    let key = child.key;
    
    let newNode = document.createElement('li');
    let newListItem = document.createElement('div');
    
    let titleInput = document.createElement('input');
    titleInput.style.display = 'none';
    newListItem.appendChild(titleInput);
    let directorInput = document.createElement('input');
    directorInput.style.display = 'none';
    newListItem.appendChild(directorInput);
    let yearInput = document.createElement('input');
    yearInput.style.display = 'none';
    newListItem.appendChild(yearInput);

    let removeButton = document.createElement('button');
    removeButton.innerText = "Delete";
    removeButton.className = "removeBtn";
    removeButton.addEventListener('click', function(){
        database.ref('/' + key).remove();
    });
    newListItem.appendChild(removeButton);

    let titleLabel = document.createElement('div');
    titleLabel.innerText = "Title: " + title;
    newListItem.appendChild(titleLabel);

    let directorLabel = document.createElement('div');
    directorLabel.innerText = "Director: " + director;
    newListItem.appendChild(directorLabel);

    let yearLabel = document.createElement('div');
    yearLabel.innerText = "Year: " + year;
    newListItem.appendChild(yearLabel);
    
    let editButton = document.createElement('button');
    editButton.innerText = "Edit";
    editButton.className = "editButton";
    editButton.addEventListener('click', function() {
        titleInput.style.display = 'block';
        titleInput.value = title;
        directorInput.style.display = 'block';
        directorInput.value = director;
        yearInput.style.display = 'block';
        yearInput.value = year;
        titleLabel.style.display = 'none';
        directorLabel.style.display = 'none';
        yearLabel.style.display = 'none';
        changeBtn.style.display = 'block';
        editButton.style.display = 'none';
    });
    newListItem.appendChild(editButton);
    
    let changeBtn = document.createElement('button');
    changeBtn.innerText = "Update";
    changeBtn.className = "changeButton";
    changeBtn.style.display = 'none';
    changeBtn.addEventListener('click', function() {
        titleInput.style.display = 'none';
        directorInput.style.display = 'none';
        yearInput.style.display = 'none';
        titleLabel.style.display = 'block';
        directorLabel.style.display = 'block';
        yearLabel.style.display = 'block';
        changeBtn.style.display = 'none';
        editButton.style.display = 'block';
        
        let editedMovie = {
            title : titleInput.value,
            director : directorInput.value,
            year : yearInput.value
        }
        
        database.ref('/' + key).set(editedMovie);
        
    });
    newListItem.appendChild(changeBtn);

    newListItem.className = "listItem";
    newNode.appendChild(newListItem);
    theList.appendChild(newListItem);
}

function clearTheList(){
    while(theList.firstChild) {
        theList.removeChild(theList.firstChild);
    }
}