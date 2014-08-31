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
		searchTime = '#searchTime',
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
		e.preventDefault();
		var $this = $(this),
			courseVal = '',
			cuisineVal = '',
			timeVal = '';

		// Close dropdown once an item is selected
		$filterContain.removeClass(dropOpen);

		// Replace dropdown value with currently selected
		$this.parents().siblings(filterTrigger).text($this.text());

		// Set dropdown's data value
		$this.parents().siblings(filterTrigger).attr('data-value', $this.data('value'));

		// Make this one "active"
		$filterItem.removeClass('active');
		$this.addClass('active');

		var courseCheck = function () {
			var $courseTrigger = $(searchCourse).siblings(filterTrigger),
				courseText = $courseTrigger.text();

			if (courseText !== 'select course') {
				courseVal = $courseTrigger.attr('data-value');
			}
		};

		var cuisineCheck = function () {
			var $cuisineTrigger = $(searchCuisine).siblings(filterTrigger),
				cuisineText = $cuisineTrigger.text();

			if (cuisineText !== 'select cuisine') {
				cuisineVal = $cuisineTrigger.attr('data-value');
			}
		};

		var timeCheck = function () {
			var $timeTrigger = $(searchTime).siblings(filterTrigger),
				timeText = $timeTrigger.text();

			if (timeText !== 'select time') {
				timeVal = $timeTrigger.attr('data-value');
			}
		};

		if ($this.parents(searchCourse)) {
			courseVal = $this.data('value');

			// See if there's a Cuisine or Time selected
			cuisineCheck();
			timeCheck();
		} else if ($this.parents(searchCuisine)) {
			cuisineVal = $this.data('value');

			// See if there's a Course or Time selected
			courseCheck();
			timeCheck();
		} else if ($this.parents(searchTime)) {
			timeVal = $this.data('value');

			// See if there's a Course or Cuisine selected
			courseCheck();
			cuisineCheck();
		}

		// Send the request
		self.doRequest(courseVal, cuisineVal, timeVal);
	};

	// Hit the Yummly API and grab recipes
	self.doRequest = function (courseVal, cuisineVal, timeVal) {
		var searchRequest = $.ajax({
			url: 'http://api.yummly.com/v1/api/recipes?_app_id=' + yummlyID +
				'&_app_key=' + yummlyKey + '&allowedCourse[]=course^course-' + courseVal +
				'&allowedCuisine[]=cuisine^cuisine-' + cuisineVal + '&maxTotalTimeInSeconds=' +
				timeVal + '&maxResult=' + numResults,
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
				url = res.attribution.url,
				time = res.totalTime;

			$mealList.append('<li><a href="' + url + '" class="ml-contain">' +
				'<img src="' + image + '"><span>' + time + '</span></a>' +
				'<h2><a href="' + url + '">' + name + '</a></h2></li>');
		});
	};

	self.registerEvents();

})(jQuery);
