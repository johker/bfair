/**
 * Format websocket data
 */

function millisToDate(millis) {
	var n = +millis;
	var d = new Date(n);
	var f = ('0' + (d.getMonth()+1)).slice(-2) + '/' 
	+ ('0' + d.getDate()).slice(-2) + '/' 
	+ d.getFullYear() + ' ' 
	+ ('0' + d.getHours()).slice(-2) +':' 
	+ ('0' + d.getMinutes()).slice(-2) + ':' 
	+ ('0' + d.getSeconds()).slice(-2) + ' ' 
	//+ d.getMilliseconds() + 'ms';  
	return f;
}
function getLastPathElement(menuPath) {
	var elements = menuPath.split("\\");
	return elements.slice(-1)[0];	
}
$.fn.animateHighlight = function(highlightColor, duration) {
	var highlightBg = highlightColor || "#FFFF9C";
	var animateMs = duration || 900;
	var originalBg = this.css("backgroundColor");
	this.stop().css("background-color", highlightBg).animate({backgroundColor: originalBg}, animateMs)
}; 	
function setAndHighlight(selector, value) {	
	if($('#' + selector).text().localeCompare(value) != 0) {
		$('#' + selector).text(value);
		$('#' + selector)
			.animate( { backgroundColor: "#E6E6E6" }, 500 )
			.animate( { backgroundColor: "transparent" }, 500 );
	}
}

/** Error and confirmation message handling */

function setErrorMessages(title, errmsgs) {
	$("#errtitle").append('<strong>' + title + '</strong>');
	for (var i in errmsgs) {
		$("#erritems").append('<li>' + errmsgs[i] + '</li>');
	}
}
function resetMessages() {
	$('#erritems li').remove();
	$('#errtitle strong').remove();
	$('#confcontent li').remove();
	$('#conftitle strong').remove();							
}
function setConfirmationMessages(title, msg) {
	$("#conftitle").append('<strong>' + title + '</strong>');
	$("#confcontent").append('<li>' + msg + '</li>');
}
