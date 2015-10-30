var map,message;

function initMap() 
{
	get_location();
}

function get_location()
{
	document.getElementById("area_name").innerHTML = "位置情報取得します。";
	if(navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition
		(successCallback,errorCallback);
	}
	else
	{
		message = "本ブラウザではGeolocationが使えません";
		document.getElementById("area_name").innterHTML = message;
	}
}

function successCallback(pos)
{
	var Position_latitude = pos.coords.latitude;
	var Position_longitude = pos.coords.longitude;
	initialize(Position_latitude,Position_longitude);
}

function errorCallback(error)
{
	message = "位置情報が許可されていません";
	document.getElementById("area_name").innerHTML = message;
}

function initialize(x,y)
{
	document.getElementById("area_name").innerHTML = message;
	var myLatlng = new google.maps.LatLng(x,y);
	var mapOptions = {
		zoom: 17,
		center: myLatlng,
		mapTypeID: google.maps.MapTypeId.HYBRID
	}
	var map = new google.maps.Map(document.getElementById("map"),mapOptions);
}