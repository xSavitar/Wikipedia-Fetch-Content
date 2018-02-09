$(document).ready(function () {
	/* Toggle sidebar when hambugger menu is clicked on mobile view */
	$('.navbar-toggle').click(function () {
		$('.navbar-nav').toggleClass('slide-in');
		$('.side-body').toggleClass('body-slide-in');
		$('#search').removeClass('in').addClass('collapse').slideUp(200);
	});

	/* On-click on the fetch button, perform search */
	$('#fetch').click(function(e){
		e.preventDefault();
		var url = wikipedia_fetch_url();
		$.ajax( {
			type: "GET",
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				console.log(url);
				if(data.hasOwnProperty('parse')){
					//Hide default title placeholder and show title after search
					$('#title').hide();
					document.getElementById('title').innerHTML = data.parse.title;
					$('#title').show();

					//Show fetched content after the search
					$('#content').hide();
					document.getElementById('content').innerHTML = data.parse.text['*'];
					$('#content').show();
				} else {
					$('#title').hide();
					document.getElementById('title').innerHTML = "Error Occured :(";
					$('#title').show();

					$('#content').hide();
					document.getElementById('content').innerHTML = "Article doesn't exist in selected language or error occured!";
					$('#content').show();
				}
			}
		});
	});

	/* Fire autocomplete feature on keyup */
	$('#article_name').keyup(function(e)){
		var api_url = wikipedia_autocomplete_url();

		$.ajax( {
			type: "GET",
			url: api_url,
			dataType: 'jsonp',
			success: function(response) {
				var articles = response.search;
				var wrapper = 'articles_list';
                $(wrapper).children().remove(); //resetting list
				
				// loop through item list and append li with content
				$(mentors).each(function(position, mentor) {
					$(wrapper).append( 
					'<li>'+
						'<span class="title"><b>' + mentor.name + '</b>'+
					'</li>' 
					);
				});
				
			}
		});


	}
});

/* JS function to build the Fetch URL */
function wikipedia_fetch_url() {
	var article_name = $('#article_name').val();
	var language = $('#language').val();
	var base_url = "https://" + language + ".wikipedia.org/w/api.php";
	var data_format = "&format=json";
	var request_url = "?action=parse&prop=text&page=" + article_name;
	var url = base_url + request_url + data_format;
	return url;
}

/* Autocomplete */
function wikipedia_autocomplete_url() {
	var article_name = $('#article_name').val();
	var language = $('#language').val();
	var base_url = "https://" + language + ".wikipedia.org/w/api.php";
	var data_format = "&format=json";
	var request_url = "?action=parse&prop=text&page=" + article_name;
	var url = base_url + request_url + data_format;
	return url;
}


