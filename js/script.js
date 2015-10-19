var gOrdArray = [];
var gConsistArray = [];
var gOrderId;

//------------------------------------------------------------------
// Loading data

function getData(sendData, successFunc) {
	// JSONPlaceholder
	// http://jsonplaceholder.typicode.com
	// Fake Online REST API for Testing and Prototyping
	$.support.cors = true; // - fix one IE bug
	$.ajax('http://jsonplaceholder.typicode.com/posts', {
		method: 'POST',
		dataType: 'json',
		data: {'value':sendData},
		success: function(resp, status) {
			console.log('all is ok - ', status);
			console.log(resp);
			successFunc(resp.value);
		},
		error: function(req, status, err) {
			console.log('something went wrong - ', status, err);
			successFunc(sendData);	//fallback version
		}
	});
}

function successOrders(str) {
	var code;
	var n = 0;
	try 
	{ 
		gOrdArray = JSON.parse(str);
		for (var ord in gOrdArray)
		{
			gOrdArray[ord].ready = false;
			n++;
			code = "<li class=\"order\" id=\"ord_" + ord + "\">"  + n + ". "
				+ gOrdArray[ord].consist + "<span class=\"order-right\"> ["
				+ gOrdArray[ord].time + "]\n" + "<span class=\"value\">"
				+ gOrdArray[ord].value + "</span> руб.</span></li>";
			$("#orderList").append(code);
		}
		$('#loader').hide();
		$("li.order").click(function(){
			selectOrder($(this));
			clearOrder();
			showOrder($(this));
		});
	}
	catch (er)
	{
		alert(er);
	}
}

function successConsist(str) {
	try 
	{ 
		gConsistArray = JSON.parse(str);
		//showOrder();
	}
	catch (er)
	{
		alert(er);
	}
}

//------------------------------------------------------------------
// Interacting

function selectOrder(obj) {
	$("#orderList .selected").removeClass("selected");
	$(obj).addClass("selected");
}

function clearOrder() {
	$("#consistTable tr").has("td").remove();
}

function showOrder(obj) {
	if (gConsistArray.length == 0) {
		return;
	};
	var str = obj.attr("id");
	gOrderId = parseInt(str.substr(4)); // getting order's id
	var code;
	var n = 0;

	for (var con in gConsistArray) {	// filling the table
		// fields: "id", "name", "weight", "value", "amount", "totalV"
		if (gOrderId == gConsistArray[con].id) {
			$("#consistTable").append("<tr></tr>");
			n++;
			code = "<td>" + n + "</td>"
				+ "<td>" + gConsistArray[con].name + "</td>"
				+ "<td>[" + gConsistArray[con].weight + "]</td>";
			if (gConsistArray[con].amount > 1) {	// amount of portions
				code += "<td>" + gConsistArray[con].value + " руб.</td>"
				+ "<td>" + gConsistArray[con].amount + " порц.</td>";
			} else {
				code += "<td></td><td></td>";
			}
			code += "<td>" + gConsistArray[con].totalV + " руб.</td>";
			$("#consistTable tr:last").append(code);
		}
	};
	code = "<tr>"
			+ "<td></td><td></td><td></td><td></td>"
			+ "<td>Всего:</td>"
			+ "<td>" + gOrdArray[gOrderId].value + " руб.</td>"
		+ "</tr>";
	$("#consistTable").append(code);
	$("#setReady").removeClass("hidden");
	if (gOrdArray[gOrderId].ready) { // showing or hiding button and icon
		$("#setReady .iconReady").removeClass("hidden");
		$("#setReady button").prop("disabled", true);
	} else {
		$("#setReady .iconReady").addClass("hidden");
		$("#setReady button").prop("disabled", false);
	}
}

//------------------------------------------------------------------
// Button pressed

function setReady() {
	$("#setReady .iconReady").removeClass("hidden");
	$("#setReady button").prop("disabled", true);
	$("#ord_" + gOrderId).addClass("ready");
	gOrdArray[gOrderId].ready = true;
	sendData("order #" + gOrderId + " is ready");
}

function checkReadiness() {
	var done = true;
	for (var ord in gOrdArray) {
		if (!gOrdArray[ord].ready) {
			done = false;
			break;
		}
	}
	if (done) { // Well done!
		alert("Все заказы выполнены!");
	};
}

function sendData(someData) {
	// Some AJAX actions for example
}

//------------------------------------------------------------------
// Document ready

$( document ).ready(function() {
	getData(gOrdList, successOrders);
	getData(gConsistList, successConsist);

	$("#setReady button").click(function(){
			setReady();
			checkReadiness();
		});
	//showOrder();	
});