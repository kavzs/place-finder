// Initiate map
const version = '?v=20170901';
const clientid = '&client_id=AVN22MT2XHHXNHVBHGQMTYOKYCBQOJQMLF1GJOU30N1JDEXH';
const clientSecret = '&client_secret=GU0EDF0V2GPP2GXLCEQMYP1ILA3PG3CPRXCJP23SLMYFU41G';
const key = version + clientid + clientSecret;

// Lines of code to get breakpoint
let breakpoint = {};
breakpoint.refreshValue = function() {
	this.value = window.getComputedStyle(document.querySelector('body'), ':before')
										 .getPropertyValue('content').replace(/\"/g, '');
}
$(window).resize(function() {
	breakpoint.refreshValue();
}).resize();

// Pseudo-constructor for divs
$('#search-options').data('isOpen', false);
$('#search-details').data('isOpen', false);


let center = [-36.849046,174.765305];
let map = L.map('map',{zoomControl:false}).setView(center,15);
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWJldGxvZ2FuIiwiYSI6ImNqNmFhNWw0czEwcWUycG55Z3h3YzFyMGYifQ.txrUggxbLPIanNvZxtaAYQ').addTo(map);
L.circle(center, {
					radius: 500,
					color: 'salmon',
					weight:1,
					fill:false
				}).addTo(map);
//Explore venues -- foursquare api
let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll=-36.849046,174.765305';
$.ajax({
	url:exploreUrl,
	dataType:'jsonp',
	success:function(res){
		let data = res.response.groups[0].items;
		console.log(data);
		let venues = _(data).map(function(item){
			return {
					latlng:[item.venue.location.lat,item.venue.location.lng],
					description: item.venue.name,
					iconImage: getIcon(item.venue.categories[0].shortName),
					venueid: item.venue.id,
					category: item.venue.categories[0].shortName
				};
		});
		_(venues).each(function(venue){
			let venueIcon = L.icon({
										iconUrl: venue.iconImage,
										iconSize:[35,35]
									});
			let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(map);
			marker.venueid = venue.venueid;
			marker.on('click', function(e){
				console.log(venue.category);
				let venueUrl = 'https://api.foursquare.com/v2/venues/' + this.venueid + key;
				$.ajax({
					url:venueUrl,
					dataType:'jsonp',
					success:function(res){
						let photos = res.response.venue.photos.groups[0].items;
						$('.modal-title').text(res.response.venue.name);
						$('.modal-body').empty();
						_(photos).each(function(photo){
							let photoPath = photo.prefix + '100x100' + photo.suffix;					
							$('<img src=' + photoPath + '>').appendTo('.modal-body');
						});
						$('#myModal').modal('show');
					}
				});

					toggleSearchDetails();
					setTimeout(function(){
						map.invalidateSize(true);
						map.setView(e.target.getLatLng(),17);
					},500);									
			});
		});
	}
});

function getIcon(category) {
	if (~category.indexOf('Bar') || ~category.indexOf('Brewery')) {
		return 'svg/food/002-soft-drink-3.svg';
	} else if (~category.indexOf('Café') || ~category.indexOf('Coffee')) {
		return 'svg/food/050-fried-egg.svg';
	} else if (~category.indexOf('Desserts') || ~category.indexOf('Ice Cream')) {
		return 'svg/food/008-ice-cream-2.svg';		
	} else if (~category.indexOf('Restaurant') || ~category.indexOf('Food')) {
		return 'svg/food/032-bread.svg';		
	} else if (~category.indexOf('Japanese')) {
		return 'svg/food/056-sushi.svg';		
	} else if (~category.indexOf('Burgers')) {
		return 'svg/food/047-burger.svg';		
	} else if (~category.indexOf('Mexican')) {
		return 'svg/food/070-burrito.svg';		
	} else if (~category.indexOf('Steak')) {
		return 'svg/food/001-steak.svg';		
	} else if (~category.indexOf('Pizza')) {
		return 'svg/food/065-pizza.svg';		
	} else if (~category.indexOf('Bakery')) {
		return 'svg/food/032-bread.svg';		
	} else {
		return 'svg/food/010-pie.svg';
	}
}

$('#start-search').on('click',function(e){
	e.preventDefault();
	toggleSearchOptions();
});

$('.search-close').on('click',function(e){
	e.preventDefault();
	closeSection($(this).parent().parent());
});

$('#search-button').on('click',function(e){
	e.preventDefault();
	// toggleSearchOptions();
})

// FUNCTIONS
function toggleSearchOptions() {
	$('#search-options').slideToggle(500, 'swing');
	toggleSearchData('#search-options');
	if ($('#search-details').data('isOpen') == true) {
		toggleSearchDetails();
	}
	// $('#map').css('height','calc(100vh-');
}

function closeSection(div){
	$(div).slideToggle(500,'swing');
	toggleSearchData($(div));
	if (div[0].id == 'search-details') {
		if(breakpoint.value == 'phone') {
			$('#map').css('height', 'calc(100vh - 58px)');
			setTimeout(function(){
			map.invalidateSize(true);	
		},500);	
		} else if (breakpoint.value == 'tablet') {
			$('#map').css('height', '100vh');
			setTimeout(function(){
			map.invalidateSize(true);	
		},500);	
		}
		
	}
}

function toggleSearchData(id) {
	if ($(id).data('isOpen') == true) {
		$(id).data('isOpen', false);
	} else {
		$(id).data('isOpen', true);
	}
	// remove after doing testing.
	console.log('open: ' + $(id).data('isOpen')); 
}

function toggleSearchDetails() {
	if ($('#search-details').data('isOpen') == false) {
		$('#search-details').slideToggle(500, 'swing');
		toggleSearchData('#search-details');
		if (breakpoint.value == 'phone') {
			$('#map').css('height','calc(50vh - 58px)');	
		} else if (breakpoint.value == 'tablet') {
			$('#map').css('height','50vh');	
		}
	}
}