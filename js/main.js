const pages = [
               "home",
               "shopping",
               "profile"
			   ];

const networkPlugin = document.getElementById('pluginObjectNetwork');
const internetConnectionInterval = 500;

(function () {
	const container = $('#fragment_container');
	
	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageid = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageid = page ? page.id : "";

			if (pageid === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
	
	setInterval("cyclicInternetConnectionCheck", internetConnectionInterval);

	$(".home-tabs a").click(function() {
		$("li.is-active").removeClass();
		var parent = $(this).parent();
		parent.removeClass();
		parent.addClass('is-active');
		$.get("../views/pages/" + pages[$(this).data("index")] + ".html", function(html_string) {
			container.html(html_string);
		},'html');
	})
	
	email = localStorage.getItem("email")
	if(email) {
		password = localStorage.getItem("password")
		login(email, password)
	}
}());

function checkConnection() {

	var gatewayStatus = 0,
  
	// Get active connection type - wired or wireless.
  
	currentInterface = networkPlugin.GetActiveType();
  
	// If no active connection.
  
	if (currentInterface === -1) {
  
	  return false;
  
	}
  
	// Check Gateway connection of current interface.
  
	gatewayStatus = networkPlugin.CheckGateway(currentInterface);
  
	// If not connected or error.
  
	if (gatewayStatus !== 1) {
  
	  return false;
  
	}
  
	// Everything went OK.
  
	return true;
  
  }

function cyclicInternetConnectionCheck() {

	if(!checkConnection() ){
  
	  // no internet connection
		console.log('no internet')
	  if(!internetConnectionPopup.isShown){
  
		internetConnectionPopup.show();
  
		Player.stop();
  
	  }
  
	} else {
  
	  // if error message was shown, it should be returned back to normal
		console.log('internet')
	  if(internetConnectionPopup.isShown){
  
		internetConnectionPopup.hide();
  
		//  return to normal screen
  
	  }
  
	}
  
  }

function navigateToCategory(categoryName) {
	$.ajax({
		url: GET_ALL_LABEL_URL + categoryName
	}).done(function(result) {
		var container = $('#more-list-container');
		container.html("");
		$.get("../views/components/more_recipe_item.html", function(html_string) {	
			$.each(result, function(i, recipe) {
				var topAppendString = String(html_string);
				topAppendString = topAppendString.replace("#more_recipe_img#", IMAGES_URL + recipe.image_url).replace("#more_recipe_name#", recipe.name)
					.replace("#recipe_rating#", recipe.rating).replace("#recipe_calories#", recipe.calories).replace("#recipe_servings#", recipe.servings)
					.replace("#recipe_id#", recipe.id)
				container.append(topAppendString);
			})
		},'html');
	});
	tau.changePage("#category");
}

function navigateToRecipeDetails(recipeId) {
	$.ajax({
		url: RECIPES_URL + recipeId
	}).done(function(recipe) {
		$.ajax({
			url: USERS_URL + recipe.user_id
		}).done(function(user) {
			$.get("../views/pages/recipe_details.html", function(html_string) {	
				var stepsJsonString = JSON.stringify(recipe.steps);
				stepsJsonString = stepsJsonString.replace(/'/g, "~").replace(/"/g, "'");
				html_string = html_string.replace("#recipe_img#", IMAGES_URL + recipe.image_url).replace("#recipe_name#", recipe.name)
					.replace("#recipe_duration#", recipe.time).replace("#recipe_calories#", recipe.calories).replace("#recipe_servings#", recipe.servings)
					.replace("#recipe_rating#", recipe.rating).replace("#user_img_url#", user.image_url).replace('#recipe_dsc#', recipe.description)
					.replace("#steps#", stepsJsonString).replace("#recipe_id#", recipeId).replace("#user_id#", user.id)
				var container = $('#recipe_details_content');
				container.html(html_string);
				tau.changePage("#recipe_details")
			},'html');
		});
	});
}

function login(email, password) {
	$.ajax({
		url: POST_SIGN_IN_URL, // url where to submit the request
		type : "POST", // type of action POST || GET
		dataType : 'json', // data type
		data : { email: email, password: password, uuid: '-1', type: 'tz', token: 'null' }, // post data || get data
		success : function(data, textStatus, jqXHR) {
			if(jqXHR.status == 200) {
				connectedUserId = data.id
				localStorage.setItem("email", email)
				localStorage.setItem("password", password)
				$('li.is-active > a').click()
				tau.changePage('#main')
			} else {
				alert("Please check your credentials!")
			}
		},
		error: function(xhr, resp, text) {
			alert("Please check your credentials!")
		}
	})
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function logout() {
	connectedUserId = ""
	localStorage.clear()
	$('#username').val('')
	$('#password').val('')
	tau.changePage("#login")
}

function login_event(event) {
	event.preventDefault();
	username = $("#username")
	password = $("#password")
	if(!username || !username.val() || !password || !password.val()) {
		alert("Username and password are mandatory!")
		return
	}
	if(!validateEmail(username.val())) {
		alert("Not a valid email!")
		return
	}
	login(username.val(), password.val())
}

function navigateToProfile(userId) {
	container = $('#profile-container')
	container.html('')

	$.get("../views/components/profile_component.html", function(profile_html_string) {
		container.html(profile_html_string.replace("#profile_userid#", userId))
		tau.changePage('#profile')
	})
}