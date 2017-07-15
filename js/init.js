/**
 * On Page load Get first 10 Businesses
 * Generate Page Buttons
 */
$( document ).ready(function() {

    // Load first 10 businesses as default
    $.get('https://www.cs.kent.ac.uk/people/staff/lb514/hygiene/hygiene.php', function( data ) {
        loadTableData(data);
    },"json");

    // Generate Page number buttons
    $.get( "https://www.cs.kent.ac.uk/people/staff/lb514/hygiene/hygiene.php", { op: "pages" } )
        .done(function( data ) {
        var amountOfPages = $.parseJSON(data);
        amountOfPages = amountOfPages.pages;
        
        var pageButtons = $('#pageButtons');
        for(i = 1; i <= amountOfPages; i++){
                pageButtons.append('<input type="button" class="pageButton" id="page' + i + '" value="' + i + '"/>')
        }

        },"json");
});

/**
 * Event bound to each page button
 * Gets the value of the button which is the page number we want
 * Calls server to get that page & updates table
 */
$(document).on('click', '.pageButton', function () {
    
    //Get the page number they have clicked
    var thePage = $(this).attr("value");
    $.get( "https://www.cs.kent.ac.uk/people/staff/lb514/hygiene/hygiene.php", { op: "retrieve", page: thePage  }, function( data ) {
            loadTableData(data);
        },"json");
});

/**
 * An event bound to the search button that will submit
 * an ajax request and load the table with businesses 
 * matching the search string.
 */
$(document).on('click', '#searchButton', function () {

    // Get search input	
    var searchInput = $('#searchInput').val();

    if(searchInput == ''){
    alert("Please enter a search term.");
    return;
    }

    $.get( "https://www.cs.kent.ac.uk/people/staff/lb514/hygiene/hygiene.php", { op: "searchname", name: searchInput  }, function( data ) {
            loadTableData(data);
            $('#searchInput').val('');
        },"json");
});


/**
 * Function that binds to the customer rating buttons
 * Get the business send as parameter to script
 * Clear the table & popup contents
 * Perform ajax request
 * Process the request to try and get correct match
 * load the pop up dialog
 */
$(document).on('click', '.custRatingButton', function () {

    //ID of clicked button has the business name and postcode that we use to match
    // Seperated with _
    var idString= $(this).attr('id');
    idString = idString.split('_');
    var searchValue = idString[1].split(' ');

    //Chose a search value based on the length of restaurant name
    if(searchValue.length > 2){
        var businessName = searchValue[1];
    }
    else{
        var businessName = searchValue[0];
    }

        // Perform ajax request
        $.get( "https://www.cs.kent.ac.uk/people/staff/lb514/hygiene/rating.php", { op: "searchname", name: businessName  }, function( data ) {

            //Clear the table & text on popup
            $('#ratings_table').hide();
            $("#ratings_table td").parent().remove();
            $('#popUpDetails').empty();

            // Is the response empty?
            if (jQuery.isEmptyObject(data)){
                $('#popUpDetails').append("Sorry, we couldn't find any data for that restaurant.");
            }
            else{
                data = processRatingResponse(data,idString);
                if (data.length > 0){
                    loadPopUpTableData(data);
                }
            }
        },"json");
        $( "#popUp" ).dialog({
            width: 700
        });
});