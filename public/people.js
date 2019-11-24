document.addEventListener('DOMContentLoaded', function () {

    let peopleButton = document.getElementById("myPeople");

    peopleButton.addEventListener('click', async function () {
        try {
            let response = await fetch('http://127.0.0.1:8090/people/list');
            let body = await response.text();

            document.getElementById('person-txt').innerHTML = '<ul>';

            let people = JSON.parse(body);
            for (let i = 0; i < people.length; i++) {
                // make it show data properly in a minute
                document.getElementById('person-txt').innerHTML += '<h2>'+ people[i].name + '</h2>';
            }

            document.getElementById('person-txt').innerHTML += '</ul>';
        } catch (error) {
            document.getElementById('person-txt').innerHTML = 'An error occurred! Please try again later.';
        }

    });

    let addPersonButton = document.getElementById("addPersonButton");
    console.log(addPersonButton);
    addPersonButton.addEventListener('click', async function () {
        if (addPersonButton.innerText != 'Add a new person') {

            let text = document.getElementById("new-hobbies").value;
            var temp = text.split("\n");

            // remove blank lines
            var dataToSend = temp.filter(function (value, index, arr) {
                return value != "";
            });

            let response = await fetch('http://127.0.0.1:8090/people/add', {
                method: 'POST',
                body: JSON.stringify(dataToSend),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // go into view mode and remake the sentences

            console.log("phase 2")

            editHobbies.innerText = 'Edit';

            document.getElementById("add-person-txt").innerHTML = "<ul>"
            for (i in dataToSend) {
                document.getElementById("add-person-txt").innerHTML += '<li>' + dataToSend[i] + '</li>';
            }
            document.getElementById("add-person-txt").innerHTML += "</ul>";
            console.log("phase 3")
        } else {
            // go into edit mode
            console.log('adding person');
            editHobbies.innerText = 'Go!';

            document.getElementById("add-person-txt").innerHTML = "<div class='container'>"
            document.getElementById("add-person-txt").innerHTML +="<div class='row'><div class='col-4'>Name</div><div class='col-4'><input id='name-input' type='text'></div></div>";
            document.getElementById("add-person-txt").innerHTML +="<div class='row'><div class='col-4'>Image</div><div class='col-4'><input id='img-input' type='text'></div></div>";
            document.getElementById("add-person-txt").innerHTML +="<div class='row'><div class='col-4'>Description</div><div class='col-4'><textarea id='desc-input' autofocus rows=\'5\' cols=\'45\'></textarea></div></div>";
            document.getElementById("add-person-txt").innerHTML +="<div class='row'><div class='col-4'>Memories</div><div class='col-4'><textarea id='memories-input' autofocus rows=\'5\' cols=\'45\'></textarea></div></div>";

            document.getElementById("add-person-txt").innerHTML += "</div>";

        }

    });

    
});
