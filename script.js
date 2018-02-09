$(document).ready(function () {
	
	// Global variables
	var articles_wrapper 	= '#articles_list';
	var article_field		= '#article_name';
	var language_field 		= '#language';

	/* Toggle sidebar when hambugger menu is clicked on mobile view */
	$('.navbar-toggle').click(function () {
		$('.navbar-nav').toggleClass('slide-in');
		$('.side-body').toggleClass('body-slide-in');
		$('#search').removeClass('in').addClass('collapse').slideUp(200);
	});

	/* On-click on the fetch button, perform search */
	$('#fetch').click(function(e){
		e.preventDefault();
		var url = wikipedia_fetch_url(article_field, language_field);
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
	$(article_field).keyup(function(e){
		
		var term = $(this).val();
		var api_url = wikipedia_autocomplete_url(article_field, language_field);

		console.log(api_url);

		$.ajax( {
			type: "GET",
			url: api_url,
			dataType: 'jsonp',
			success: function(response) {
				var articles = response.query.search;

                $(wrapper).children().remove(); //resetting list
				
				// loop through item list and append li with content
				$(articles).each(function(position, article) {
					$(wrapper).append( 
					'<li>'+
						'<span class="title"><b>' + article.title + '</b>'+
					'</li>' 
					);
				});
				
			}
		});


	});

	/* Second part of autocomplete: fill the input when a result is clicked */
	// set the an action on click
	$(articles_wrapper).click(function(e) {

		// replacing article input value
		$(article_field).val($(this).text());
		$(wrapper).children().remove(); //resetting list

	});
});

/* JS function to build the Fetch URL */
function wikipedia_fetch_url( article_field, language_field ) {
	var article_name = $(article_field).val();
	var language = $(language_field).val();
	var base_url = "https://" + language + ".wikipedia.org/w/api.php";
	var data_format = "&format=json";
	var request_url = "?action=parse&prop=text&page=" + article_name;
	var url = base_url + request_url + data_format;
	return url;
}

/* Autocomplete */
function wikipedia_autocomplete_url( article_field, language_field ) {
	var article_name = $(article_field).val();
	var language = $(language_field).val();
	var base_url = "https://" + language + ".wikipedia.org/w/api.php";
	var data_format = "&format=json";
	var request_url = "?action=query&list=search&srsearch=" + article_name;
	var url = base_url + request_url + data_format;
	return url;
}


