(function ($) {

	// Yummly info
	var yummlyID = '216cd33e',
    	yummlyKey = '2396fa4ecd760e0676371861ad4d3724',
    	numResults = 50;

	// Cache jQuery objects
	var $search = $('#search'),
		$searchCourse = $('#searchCourse'),
		$searchCuisine = $('#searchCuisine'),
		$mealList = $('.meal-list');

	// Construct NeeedFoood class
    var NeeedFoood = function () {
    	var self = this;

    	$search.on('submit', function (e) {
    		// Prevent from from submitting
    		e.preventDefault();

    		// Grab user submitted values
    		var courseVal = $searchCourse.val(),
    			cuisineVal = $searchCuisine.val();

    		// Do the search using value of input
    		if (courseVal !== 'default' && cuisineVal !== 'default') {
    			self.doSearch(courseVal, cuisineVal);
    		}
    	});
    };

    NeeedFoood.prototype.doSearch = function (courseVal, cuisineVal) {
    	var self = this;

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

    NeeedFoood.prototype.fetchRecipe = function (recipeID) {
    	var self = this;

    	var recipeRequest = $.ajax({
			url: 'http://api.yummly.com/v1/api/recipe/' + recipeID + '?_app_id=' + yummlyID + '&_app_key=' + yummlyKey,
			type: 'GET',
			dataType: 'jsonp'
		});

		recipeRequest.done(function (res) {
			$mealList.append('<li>' + res.name + '</li>');
		});
    };

    // Create NeeedFoood instance
    new NeeedFoood();

})(jQuery);