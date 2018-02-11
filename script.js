
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
    while(theList.firstChild) {
        theList.removeChild(theList.firstChild);
    }
    
    if(data.val() !== null) {
        let movies = data.val();
        var keys = Object.keys(movies);
        
        for( let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let title = movies[k].title;
            let director = movies[k].director;
            let year = movies[k].year;

            let newNode = document.createElement('li');
            let newListItem = document.createElement('div');

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
    }
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
    while(theList.firstChild) {
        theList.removeChild(theList.firstChild);
    }
    
    database.ref('/').orderByChild(value).once('value', function(data) {
        
        let theDataBase = data.val();
        let objects = [];
        for(let i = 0; i < theDataBase.length; i++) {
            objects.push(theDataBase[i]);
        }
        
        data.forEach( child => {
            let object = child.val();
            let title = object.title;
            let director = object.director;
            let year = object.year;

            let newNode = document.createElement('li');
            let newListItem = document.createElement('div');

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
        })
    });
}
