
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

let addButton       = document.getElementById('addButton');
let titleInput      = document.getElementById("title");
let directorInput   = document.getElementById("director");
let yearInput       = document.getElementById("year");
let listDisplay     = document.getElementById("listDisplay");
let theList         = document.getElementById("theList");
let sortTitleBtn    = document.getElementById("sortTitleBtn");
let sortDirectorBtn = document.getElementById("sortDirectorBtn");
let sortYearButton  = document.getElementById("sortYearBtn");
let nextBtn         = document.getElementById("nextBtn");
let prevBtn         = document.getElementById("prevBtn");

let currentPage = 0;
let lastPage = 0;
let sortByChild = "title";

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
    updateList();
});

sortTitleBtn.addEventListener('click', function() {
    sortBy('title');
});


sortDirectorBtn.addEventListener('click', function() {
    sortBy('director');
});

sortYearBtn.addEventListener('click', function() {
    sortBy('year');
});

function sortBy(value) {
    currentPage = 0;
    sortByChild = value;
    updateList();
}

function updateList() {
    database.ref('/')
        .orderByChild(sortByChild)
        .once('value',function(data){
        clearTheList();
        addAllToList(data);
    });
}

function addAllToList(data) {
    if(data.val() !== null) {
        let listOfMovies = [];
        let listOfKeys = [];
        data.forEach( child => {
            listOfMovies.push(child.val());
            listOfKeys.push(child.key);
        })
        lastPage = Math.ceil(listOfMovies.length / 5);
        console.log("Last Page: " + lastPage);
        let startAt = currentPage * 5;
        let endAt = startAt + 5;
        for(let i = startAt; i < endAt && i < listOfMovies.length; i++) {
            addToList(listOfMovies[i], listOfKeys[i]);
        }
    }
}

nextBtn.addEventListener('click', function() {
    if(currentPage + 1 < lastPage){
        currentPage++;
        updateList();
    }
});

prevBtn.addEventListener('click', function() {
    if(currentPage !== 0) {
        currentPage--;
        updateList();
    }
});

function addToList(child, key) {
    let title = child.title;
    let director = child.director;
    let year = child.year;
    
    let newNode = document.createElement('li');
    let newListItem = document.createElement('div');

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

    newListItem.className = "listItem";
    newNode.appendChild(newListItem);
    theList.appendChild(newListItem);
}

function clearTheList(){
    while(theList.firstChild) {
        theList.removeChild(theList.firstChild);
    }
}