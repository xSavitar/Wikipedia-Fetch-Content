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
		wikipedia_fetch_and_display_page( url );

	});


	/* Fire autocomplete feature on keyup */
	$(article_field).keyup(function(e){
		
		var term = $(this).val();
		var api_url = wikipedia_autocomplete_url(article_field, language_field);

		wikipedia_fetch_and_display_titles( term, articles_wrapper, api_url );


	});

	/* Second part of autocomplete: fill the input when a result is clicked */
	$(articles_wrapper).on('click', 'li', (function(e) {

		// replacing article input value
		$(article_field).val($(this).text());
		$(articles_wrapper).children().remove(); //resetting list
		
		var url = wikipedia_fetch_url(article_field, language_field);
		wikipedia_fetch_and_display_page( url );

	}));
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

/* Ajax call for fecthing and displaying page content */
function wikipedia_fetch_and_display_page ( url ) {

	$.ajax( {
			type: "GET",
			url: url,
			dataType: 'jsonp',
			success: function(data) {
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
}

/*  Ajax call for fetching page titles based on term */
function wikipedia_fetch_and_display_titles( term, articles_wrapper, api_url ){
	// make sure field is not empty
	
	if (term.length > 0) {

		$.ajax( {
			type: "GET",
			url: api_url,
			dataType: 'jsonp',
			success: function( data) {


				var articles = null;

				if( data.query.searchinfo.hasOwnProperty('totalhits') ) { articles = data.query.search; }

				console.log(data.query);

				$(articles_wrapper).children().remove(); //resetting list
				
				// loop through item list and append li with content
				if (articles != null) {
					$(articles).each(function(position, article) {
						$(articles_wrapper).append( 
						'<li>'+
							'<b>' + article.title + '</b>'+
						'</li>' 
						);
					});
				}
				
			},
			error: function(e) {
				$(articles_wrapper).children().remove(); //resetting list
			}
		});
	} else {
		$(articles_wrapper).children().remove(); //resetting list
	}
}


