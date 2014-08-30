(function ($) {
	var self = window.NF = window.NF || {};

	// Yummly info
	var yummlyID = '216cd33e',
    	yummlyKey = '2396fa4ecd760e0676371861ad4d3724',
    	numResults = 12;

	// Cache jQuery objects
	var $search = $('#search'),
		searchCourse = '#searchCourse',
		searchCuisine = '#searchCuisine',
		$mealList = $('.meal-list'),
		$filterContain = $('.sf-drop-contain'),
		$filterItem = $('.sf-drop a'),
		filterTrigger = '.sf-trigger',
		dropOpen = 'sf-drop--open';

	// Register events
	self.registerEvents = function () {
		$(document)
			.on('click', function () {
				// Close all dropdowns on document click
				$filterContain.removeClass(dropOpen);
			})
			.on('click', filterTrigger, self.doDropdown);
			
		$filterItem.on('click', self.doSearch);
	};

	self.doDropdown = function (e) {
		e.preventDefault();
		e.stopPropagation();
		var $this = $(this),
			$filterParent = $this.parent('.sf-drop-contain');
		
		if (!$filterParent.hasClass(dropOpen)) {
			$filterContain.removeClass(dropOpen);
			$filterParent.addClass(dropOpen);
		} else {
			$filterParent.removeClass(dropOpen);
		}
	};

	// Grab some things needed for our search
    self.doSearch = function (e) {
    	// Prevent from from submitting
		e.preventDefault();

		var $this = $(this),
			courseVal = '',
			cuisineVal = '';

		if ($this.parents(searchCourse)) {
			courseVal = $this.data('value');
		} else if ($this.parents(searchCuisine)) {
			cuisineVal = $this.data('value');
		}

		// Close dropdown once an item is selected
		$filterContain.removeClass(dropOpen);

		// Do the search using value of input
		self.doRequest(courseVal, cuisineVal);
    };

    // Hit the Yummly API and grab recipes
    self.doRequest = function (courseVal, cuisineVal) {
    	var searchRequest = $.ajax({
			url: 'http://api.yummly.com/v1/api/recipes?_app_id=' + yummlyID + '&_app_key=' + yummlyKey + '&allowedCourse[]=course^course-' + courseVal + '&allowedCuisine[]=cuisine^cuisine-' + cuisineVal + '&maxResult=' + numResults,
			type: 'GET',
			dataType: 'jsonp'
		});

		// Clear out current list
		$mealList.empty();

		searchRequest.done(function (res) {
			for (var i = 0, z = numResults; i < z; i++) {
				var recipeID = res.matches[i].id;

				self.fetchRecipe(recipeID);
			}
		});
    };

    // Grab the individual recipes and spit them out
    self.fetchRecipe = function (recipeID) {
    	var recipeRequest = $.ajax({
			url: 'http://api.yummly.com/v1/api/recipe/' + recipeID + '?_app_id=' + yummlyID + '&_app_key=' + yummlyKey,
			type: 'GET',
			dataType: 'jsonp'
		});

		recipeRequest.done(function (res) {
			var name = res.name,
				image = res.images[0].hostedLargeUrl,
				url = res.attribution.url;

			$mealList.append('<li><a href="' + url + '"><img src="' + image + '"></a><h2><a href="' + url + '">' + name + '</a></h2></li>');
		});
    };

    self.registerEvents();

}) (jQuery);