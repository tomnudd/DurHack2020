let currentFavourites = "";

function change() {
    var appElement = document.querySelector('[ng-app=myApp]');
    var $scope = angular.element(appElement).scope();
    $scope.$apply(function() {
        $scope.visibilities.login = false;
        $scope.visibilities.mainMenu = true;
    });
}

document.addEventListener('DOMContentLoaded', function () {

    let meButton = document.getElementById("meButton");

    async function isLoggedIn() {
      try {
        let response = await fetch("http://127.0.0.1:8090/isLoggedIn");
        let body = await response.text();
        let parsed = JSON.parse(body);
        if (parsed.loggedIn == false) {
          console.log("yay")
          document.getElementById("auth").style.display="inline";
        } else {
          try {
            let rsp = await fetch("http://127.0.0.1:8090/user/data");
            let body2 = await rsp.text();
            let parsed2 = JSON.parse(body2);
            if (!parsed2.first_name || !parsed2.last_name) {
              document.getElementById("login").style.display="inline";
            } else {
              change();
            }
          } catch(err) {
            console.log(err);
          }
        }
      } catch(err) {
        console.log(err);
      }
    }

    isLoggedIn();

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
            console.log('sending requests');
            let response = await fetch('http://127.0.0.1:8090/favourites/list');
            let body = await response.text();

            console.log(response);
            let favourites = JSON.parse(body);
            currentFavourites = favourites;

            document.getElementById('favourites-txt').innerHTML = '<ul>';

            for (var key in favourites) {
                if (favourites[key]) {
                    document.getElementById('favourites-txt').innerHTML += '<li> My favourite ' + key.replace(/_/g, " ") + ' is ' + favourites[key] + '</li>';
                }
            }

            document.getElementById('favourites-txt').innerHTML += '</ul>';

        } catch (error) {
            document.getElementById('favourites-txt').innerHTML = 'An error occurred! Please try again later.';
        }
    });

    let editHobbies = document.getElementById("editHobbies");

    editHobbies.addEventListener('click', async function () {
        if (editHobbies.innerText != 'Edit') {
            console.log('submitting an edit');

            let text = document.getElementById("new-hobbies").value;
            var temp = text.split("\n");

            // remove blank lines
            var dataToSend = temp.filter(function (value, index, arr) {
                return value != "";
            });

            console.log("phase 1")

            let response = await fetch('http://127.0.0.1:8090/hobbies/edit', {
                method: 'POST',
                body: JSON.stringify(dataToSend),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // go into view mode and remake the sentences

            console.log("phase 2")

            editHobbies.innerText = 'Edit';

            document.getElementById("hobbies-txt").innerHTML = "<ul>"
            for (i in dataToSend) {
                document.getElementById("hobbies-txt").innerHTML += '<li>' + dataToSend[i] + '</li>';
            }
            document.getElementById("hobbies-txt").innerHTML += "</ul>";
            console.log("phase 3")
        } else {
            // go into edit mode
            console.log('going into edit mode');
            editHobbies.innerText = 'Update!';

            text = document.getElementById("hobbies-txt").innerText;
            document.getElementById("hobbies-txt").innerHTML = "<textarea id=\'new-hobbies\' autofocus rows=\'5\' cols=\'45\'>" + text + "</textarea>";
        }

    });

    let favouritesEdit = document.getElementById("editFavourites");

    favouritesEdit.addEventListener('click', async function () {
        if (favouritesEdit.innerText != 'Edit') {
            console.log('submitting an edit');
            let dataToSend = {
                "food": document.getElementById("favouritefood").value,
                "music": document.getElementById("favouritemusic").value,
                "animal": document.getElementById("favouriteanimal").value,
                "tv_programme": document.getElementById("favouritetv_programme").value,
                "radio_programme": document.getElementById("favouriteradio_programme").value,
                "book": document.getElementById("favouritebook").value,
                "place": document.getElementById("favouriteplace").value
            };
            let toSend = JSON.stringify(dataToSend);

            let response = await fetch('http://127.0.0.1:8090/favourites/edit', {
                method: 'POST',
                body: toSend,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // go into view mode and remake the sentencesd

            favouritesEdit.innerText = 'Edit';

            document.getElementById('favourites-txt').innerHTML = '<ul>';

            for (var key in dataToSend) {
                if (dataToSend[key]) {
                    document.getElementById('favourites-txt').innerHTML += '<li> My favourite ' + key.replace(/_/g, " ") + ' is ' + dataToSend[key] + '</li>';
                }
            }

            document.getElementById('favourites-txt').innerHTML += '</ul>';
        } else {
            // go into edit mode
            favouritesEdit.innerText = 'Update!';

            document.getElementById('favourites-txt').innerHTML = '<ul>';

            for (var key in currentFavourites) {
                document.getElementById('favourites-txt').innerHTML += '<li> My favourite ' + key + ' is <input id=\'favourite'+key+'\'type=\'text\' value ='+ currentFavourites[key] + '></li>';
            }

            document.getElementById('favourites-txt').innerHTML += '</ul>';
        }
    });

});
