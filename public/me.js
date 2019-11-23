let currentHobbies = "";
let currentFavourites = "";

document.addEventListener('DOMContentLoaded', function () {
    let meButton = document.getElementById("meButton");

    meButton.addEventListener('click', async function () {
        try {
            let response = await fetch('http://127.0.0.1:8090/hobbies/list');
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
            let response = await fetch('http://127.0.0.1:8090/favourites/list');
            let body = await response.text();

            let favourites = JSON.parse(body);

            document.getElementById('favourites-txt').innerHTML = '<ul>';

            for (var key in favourites) {
                if (favourites[key]) {
                    document.getElementById('favourites-txt').innerHTML += '<li> My favourite ' + key + ' is ' + favourites[key] + '</li>';
                }
            }

            document.getElementById('favourites-txt').innerHTML += '</ul>';

        } catch (error) {
            document.getElementById('favourites-txt').innerHTML = 'An error occurred! Please try again later.';
        }
    });

    let editHobbies = document.getElementById("hobbiesEdit");

    editHobbies.addEventListener('click', async function () {
        if (editHobbies.innerText != 'Edit') {
            console.log('submitting an edit');

            let text = document.getElementById("new-hobbies").value;
            var temp = text.split("\n");

            // remove blank lines
            var dataToSend = temp.filter(function(value, index, arr){
                return value != "";
            });
        
            let response = await fetch('http://127.0.0.1:8090/hobbies/edit', {
                method: 'POST',
                body: JSON.stringify(dataToSend),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // go into view mode and remake the sentences

            editHobbies.innerText = 'Edit';

            document.getElementById("hobbies-txt").innerHTML = "<ul>"
            for (i in dataToSend){
                document.getElementById("hobbies-txt").innerHTML += '<li>' + dataToSend[i] + '</li>';
            }
            document.getElementById("hobbies-txt").innerHTML += "</ul>";
        } else {
            // go into edit mode
            console.log('going into edit mode');
            editHobbies.innerText = 'Update!';

            text = document.getElementById("hobbies-txt").innerText;
            document.getElementById("hobbies-txt").innerHTML = "<textarea id=\'new-hobbies\' autofocus rows=\'5\' cols=\'45\'>" + text + "</textarea>";
        }

        // either toggles to or from edit mode

    });

    let favouritesEdit = document.getElementById("favouritesEdit");

    favouritesEdit.addEventListener('click', async function () {
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

};

function swapFavourites() {
    text = document.getElementById("favourites-txt").innerText;
    document.getElementById("favourites-txt").innerHTML = "<textarea autofocus rows=\'5\' cols=\'45\'>" + text + "</textarea>";
};
