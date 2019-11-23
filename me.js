let currentHobbies = "";
let currentFavourites = "";

document.addEventListener('DOMContentLoaded', function(){
    let meButton = document.getElementById("meButton");
    console.log(meButton);
    
    meButton.addEventListener('click', async function(){
        try {
            let response = await fetch('http://127.0.0.1:8090/hobbies/list/1');
            let body = await response.text();
    
            document.getElementById('hobbies-txt').innerHTML = '<ul>';
    
            let hobbies = JSON.parse(body);
            for (let i = 0; i < hobbies.length; i++) {
                document.getElementById('hobbies-txt').innerHTML += '<li>' + hobbies[i] + '</li>';
            }
    
            document.getElementById('hobbies-txt').innerHTML += '</ul>';
        } catch (error) {
            document.getElementById('hobbies-txt').innerHTML = 'An error occurred! Please try again later.';
        }

        try {
            let response = await fetch('http://127.0.0.1:8090/favourites/list/1');
            let body = await response.text();
    
            let favourites = JSON.parse(body);
    
            document.getElementById('favourites-txt').innerHTML = favourites;
            // format this properly once we know what format the data is in!
    
        } catch (error) {
            document.getElementById('favourites-txt').innerHTML = 'An error occurred! Please try again later.';
        }
    });

    let editHobbies = document.getElementById("hobbiesEdit");

    editHobbies.addEventListener('click', async function(){
        // either toggles to or from edit mode
        let dataToSend = document.getElementById("hobbies-txt");
    
        let response = await fetch('http://127.0.0.1:8090/hobbies/edit', {
            method: 'POST',
            body: JSON.stringify(dataToSend),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        console.log(response);
    });

    let favouritesEdit = document.getElementById("favouritesEdit");

    favouritesEdit.addEventListener('click', async function(){
        let dataToSend = document.getElementById("favourites-txt");
    
        let response = await fetch('http://127.0.0.1:8090/favourites/edit', {
            method: 'POST',
            body: JSON.stringify(dataToSend),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
    });
 
});
    
function swapHobbies() {
    text = document.getElementById("hobbies-txt").innerText;
    document.getElementById("hobbies-txt").innerHTML = "<textarea autofocus rows=\'5\' cols=\'45\'>" + text + "</textarea>";
};

function swapFavourites() {
    text = document.getElementById("favourites-txt").innerText;
    document.getElementById("favourites-txt").innerHTML = "<textarea autofocus rows=\'5\' cols=\'45\'>" + text + "</textarea>";
};
   