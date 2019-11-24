const authJWT ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYmYiOjE1NzQyNDA0MDAsImFwaV9zdWIiOiJiYWE1ZWVjZjI5M2U4NDQ1M2NkYmVlMzNhMDUyODk2YTliNjAxYTQxNzQ4Y2ZhNzBhOWNjMmQ5OTFiMjU3NGIxMTU3NDYzOTk5OTAwMCIsInBsYyI6IjVkY2VjNzRhZTk3NzAxMGUwM2FkNjQ5NSIsImV4cCI6MTU3NDYzOTk5OSwiZGV2ZWxvcGVyX2lkIjoiYmFhNWVlY2YyOTNlODQ0NTNjZGJlZTMzYTA1Mjg5NmE5YjYwMWE0MTc0OGNmYTcwYTljYzJkOTkxYjI1NzRiMSJ9.CDl88etQrkEHkCGg8_has6wFGNryyQseTFr5ylagPeJwBn10_LWvtvXhcJhuuBE5Scc6-FfPtqZPnGBeeISGU3EEDVDJZjwE_TQ3ofCj5_OS76tWxSePNjVuMe2syshu79s8KjSCN58JEEpt8V9Ea8PjOe45tAoiWmwrGBHLD6mKD5w84nRTR7UObKSYqYVfETlGyooebqpqhP-xmynxNUdUuijtwNOAOLhax69PPNfb-QDdfPFFP_dLprN0_xdxU_aN8O02XKtUPTxvviEXbV_YvzJgE60YFtewMt88cq3OEZ3UQM59nWM3f5ZPCIPK0ZGcowPWTi-dTVhwGNYN0A";
// function accountdetails(theUrl)
// {
// 	var xmlHttp = new XMLHttpRequest();
// 	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
// 	xmlHttp.setRequestHeader("Authorization", "Bearer " + authJWT);
// 	xmlHttp.setRequestHeader("Content-Type", "application/json");
// 	xmlHttp.setRequestHeader("version","1.0");
// 	xmlHttp.send( null );
// 	return xmlHttp.responseText;
// }


function create_transaction(theUrl)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
	xmlHttp.setRequestHeader("Authorization", "Bearer " + authJWT);
	xmlHttp.setRequestHeader("Content-Type", "application/json");
	xmlHttp.setRequestHeader("version","1.0");
	xmlHttp.send('{"quantity": 1}');
	return xmlHttp.responseText;
}


// function create_transaction(theUrl)
// {
//     fetch(theUrl, { 
//    method: 'post', 
//    headers: new Headers({
//      'Authorization': 'Bearer '+authJWT, 
//      'Content-Type': 'application/json',
//      'version':'1.0'
//    }), 
//    body: '{"quantity":1}'
//  });
// }


function get_all_transactions(theUrl)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.setRequestHeader("Authorization", "Bearer " + authJWT);
	xmlHttp.setRequestHeader("Content-Type", "application/json");
	xmlHttp.setRequestHeader("version","1.0");
	xmlHttp.send( null );
	return xmlHttp.responseText;
}

/*
function get_all_transactions(theUrl)
{
    fetch(theUrl, { 
   method: 'get', 
   headers: new Headers({
     'Authorization': 'Bearer '+authJWT, 
     'Content-Type': 'application/json',
     'version':'1.0'
   }), 
   body: null
 });
}*/
// console.log(accountdetails("https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/accounts"));


//Make a new random transaction


function process_new_transaction() {
	new_transaction = (create_transaction("https://cors-anywhere.herokuapp.com/https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/transactions/accounts/85960672/create"));
	new_transaction = JSON.parse(new_transaction);
	new_transaction_amount = new_transaction["Transactions"][0]["amount"];
    console.log(new_transaction_amount);
    document.getElementById("info").innerHTML = "You just spent £" + new_transaction_amount;
//     document.getElementById("detail").innerHTML="Hi for now";
	new_transaction_latitude = new_transaction["Transactions"][0]["latitude"];
	new_transaction_longitude = new_transaction["Transactions"][0]["longitude"];
	transactionUUID = new_transaction["Transactions"][0]["transactionUUID"];

	transactions = get_all_transactions("https://cors-anywhere.herokuapp.com/https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/transactions/accounts/85960672/transactions");
	obj = JSON.parse(transactions);
	obj = obj["Transactions"];
    position=false;
    price=false;
	var size = Object.keys(obj).length;
	for (i = 0; i < size; i++) {
		if (obj[i]["transactionUUID"] !== transactionUUID) {
			if (obj[i]["amount"] === new_transaction_amount) {
				console.log("They have the same amount as a previous transaction");
                price=true;
			}
			if (obj[i]["latitude"] === new_transaction_latitude && obj[i]["longitude"] === new_transaction_longitude) {
				console.log("This was bought in the same place as another item");
                position=true;
			}
		}
	}
	if(price===true && position===true)
    {
        document.getElementById("info1").innerHTML = "This was bought in the same place for the same price as something you've bought before, so you probably got this item before";        
    }
    else
    {
    if(price===true)
    {
        document.getElementById("info1").innerHTML = "You've spent the same amount before, so you might have bought the same thing before";    
    }
    if(position===true)
    {
        document.getElementById("info1").innerHTML = "You've bought something here before";
    }
    else
    {
     document.getElementById("info1").innerHTML = "Looks like you've never bought this before";   
    }
        
    }

}




