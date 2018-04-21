app.controller('HomeController', ['$scope', '$http', '$location','API_SERVER',
	function ($scope, $http, $location,API_SERVER) {
	function randLatLng(latitude,longitude) {
		return new google.maps.LatLng(latitude, longitude);
	}

	function setCurrentPosMap(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var mapOptions = {
			zoom: 9,
			center: new google.maps.LatLng(0, 0)
		};

		mapOptions.center = new google.maps.LatLng(latitude, longitude)

		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		var css = ['border-color:white;background:white;color:black;',
			'border-color:red;background:red;color:white;',
			'border-color:blue;background:blue;color:white;',
			'border-color:yellow;background:yellow;color:black;',
			'border-color:black;background:black;color:white;',
			'border-color:orange;background:orange;color:black;'];
		$http.get(API_SERVER+"/board")
		.success(function(data, status) {
			console.log(data);
			if(data && data.length>0){
				for(var i = 0; i< data.length; i++){
					new HtmlMarker(map,
						randLatLng(data[i].latitude,data[i].longitude),
						Math.ceil(Math.random() * 10),
						css[0]
					);
					css.push(css.shift());
				}
			}
		});
	}

	function initialize() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(setCurrentPosMap
				, function (error) {
					console.log(error)
				});
		}
	}

	HtmlMarker.prototype = new google.maps.OverlayView();

	function HtmlMarker(map, position, content, cssText) {
		this.setValues({
			position: position,
			container: null,
			content: content,
			map: map,
			cssText: cssText
		});

		this.onAdd = function () {
			var that = this,
				container = document.createElement('div'),
				content = this.get('content'),
				cssText = this.get('cssText') || 'border-color:#fff;background:#fff;color:#000;';
			container.className = 'HtmlMarker';
			container.style.cssText = cssText;

			google.maps.event.addDomListener(container, 'click',

				function () {
					google.maps.event.trigger(that, 'click');
				});
			if (typeof content.nodeName !== 'undefined') {
				container.appendChild(content);
			} else {
				container.innerHTML = content;
			}

			container.style.position = 'absolute';
			this.set('container', container)
			this.getPanes().floatPane.appendChild(container);
		}

		this.draw = function () {
			var pos = this.getProjection().fromLatLngToDivPixel(this.get('position')),
				container = this.get('container');
			container.style.left = pos.x - (container.offsetWidth / 2) + 'px';
			container.style.top = pos.y - (container.offsetHeight) + 'px';
		}

		this.onRemove = function () {
			this.get('container').parentNode.removeChild(this.get('container'));
			this.set('container', null)
		}
	}

	// google.maps.event.addDomListener(window, 'load', initialize);
	initialize();
}]);
