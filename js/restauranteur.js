/**
 * The response for finding customer ratings can be quite complex
 * We can have 0 to many matches
 * This function finds the best match for the selected business
 * If there is just one match return the original data
 * If more than one match check other parameters such as postcode
 * to attempt to match it.
 * If we have multiple matches but can't match the address then clear
 * data and return it as empty
 * @param data - the JSON response
 * @param idString - the id of the button clicked we have seperated
 */
function processRatingResponse(data,idString){
    
    if(data.length > 1){
        var postcode = idString[2];
        var foundMatch = false;

        // For each matched name see if the address is correct
        for(var i = 0; i < data.length; i++) {
            var item = data[i];
            if(item.address.includes(postcode)){
                var matchedItem = [];
                matchedItem[0] = item;
                data = matchedItem;
                foundMatch = true;
                break;
            }
        }

        // If address was not correct for any matches then clear the array
        if(!foundMatch){
            data = [];
            $('#ratings_table').hide();
            $('#popUpDetails').append("Sorry, we couldn't find any data for that restaurant.");
        }
    }

    return data;
}


/**
 * Write out information to the restaurant hygeine table
 * based on the ajax response
 * @param data - the JSON response
 */
function loadTableData(data){

    //Clear the table
    $("#restaurants_table td").parent().remove();

    var tableData = '';

    $.each(data, function (i, item) {
        tableData += '<tr><td>' + item.business + '</td><td>' + item.address + '</td><td>' + item.rating + '</td><td>' +  item.date + ' </td><td>' + '<input type="button" class="custRatingButton" id="custRating_' + item.business + '_' + item.postcode  +'" value ="Get Rating"/>' + '</td></tr>' ;
    });

    $('#restaurants_table').append(tableData);
}

/**
 * Write out the customer rating table information
 * based on the ajax response
 * @param data - the JSON response
 */
function loadPopUpTableData(data){

    $('#popUpDetails').append("Here is the customer rating for this business ")

    var tableData = '';

    $.each(data, function (i, item) {
        tableData += '<tr><td>' + item.business + '</td><td>' + item.address + '</td><td>' + item.rating + '</td></tr>';
    });

    $('#ratings_table').append(tableData);
    $('#ratings_table').show();
}
