$(function() {
	const image1 = $("#sugg_1");
	const image2 = $("#sugg_2");
	const image3 = $("#sugg_3");
	const image4 = $("#sugg_4");
	const chefText = $("#chef-text");
	const container = $('#categories-container');
	const newsFeedContainer = $('#newsfeed-container');
	$.ajax({
		url: GET_SUGGESTION_URL
	}).done(function(result) {
		chefText.text(result.title);
		
		image1.attr("src", IMAGES_URL + result.recipes[0].image_url)
		image1.data("recipeid", result.recipes[0].id)

		image2.attr("src", IMAGES_URL + result.recipes[1].image_url)
		image2.data("recipeid", result.recipes[1].id)

		image3.attr("src", IMAGES_URL + result.recipes[2].image_url)
		image3.data("recipeid", result.recipes[2].id)

		image4.attr("src", IMAGES_URL + result.recipes[3].image_url)
		image4.data("recipeid", result.recipes[4].id)
	});


	$.get("../views/components/horizental_category.html", function(html_string) {
		var topRatedHtmlString = String(html_string);
		var healthyHtmlString = String(html_string);
		var cheapHtmlString = String(html_string);
		container.html("");
		$.ajax({
			url: RECIPES_URL + "top"
		}).done(function(topResult) {
			var topJsonString = JSON.stringify(topResult);
			topJsonString = topJsonString.replace(/'/g, "~").replace(/"/g, "'");
			console.log("Top: " + topJsonString);
			topRatedHtmlString = topRatedHtmlString.replace("#data#", topJsonString).replace("#category_title#", "Top Rated").replace(/#category_id#/g, "top")
			container.append(topRatedHtmlString);
			$.ajax({
				url: GET_LALEB_URL + "Healthy"
			}).done(function(healthyResult) {
				var healthyJsonString = JSON.stringify(healthyResult);
				healthyJsonString = healthyJsonString.replace(/'/g, "~").replace(/"/g, "'");
				console.log("Healthy: " + healthyJsonString);
				healthyHtmlString = healthyHtmlString.replace("#data#", healthyJsonString).replace("#category_title#", "Healthy").replace(/#category_id#/g, "Healthy")
				container.append(healthyHtmlString);
				$.ajax({
					url: GET_LALEB_URL + "Cheap"
				}).done(function(cheapResult) {
					var cheapJsonString = JSON.stringify(cheapResult);
					cheapJsonString = cheapJsonString.replace(/'/g, "~").replace(/"/g, "'");
					console.log("Cheap: " + cheapJsonString);
					cheapHtmlString = cheapHtmlString.replace("#data#", cheapJsonString).replace("#category_title#", "Cheap").replace(/#category_id#/g, "Cheap")
					container.append(cheapHtmlString);
				});
			});
		});
	},'html');

	$.ajax({
		url: GET_FEED_URL + connectedUserId //Connected User ID
	}).done(function(result) {
		$.get("../views/components/news_feed_card.html", function(html_string) {
			newsFeedContainer.html("");
			$.each(result, function(i, feed) {
				var htmlStringInstance = String(html_string);
				htmlStringInstance = htmlStringInstance.replace("#user_img#", feed.user.image_url)
					.replace("#user_name#", feed.user.username)
					.replace("#user_id#", feed.user.id)
					.replace("#recipe_date#", $.format.date(feed.recipe.date, "dd MMM, yyyy"))
					.replace("#recipe_img#", IMAGES_URL + feed.recipe.image_url)
					.replace("#recipe_rating#", feed.recipe.rating)
					.replace("#recipe_name#", feed.recipe.name)
					.replace("#recipe_views#", feed.recipe.views)
					.replace(/#news_recipe_id#/g, feed.recipe.id)
				newsFeedContainer.append(htmlStringInstance)
			})
		},'html');
	});
});

function toRecipeDetailsHome(view) {
	navigateToRecipeDetails($(view).data("recipeid"))
}