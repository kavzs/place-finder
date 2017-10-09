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