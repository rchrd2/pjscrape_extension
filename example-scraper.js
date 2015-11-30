define({
    title: "Piedmont Piano",
    url: "http://www.piedmontpiano.com/Webpages/11concertpage.html",
    scraper: function (){
        return function($){
            var data = [];
            var curr_month = '';
            var curr_year = '';
            jQuery('div table:nth-child(1) td').find('*').each(function(index, elem) {
                $elem = jQuery(elem);
                //console.log($elem);

                if( $elem.is('table div p') ) {
                    var curr_month_year = String($elem.text());
                    curr_month_year = curr_month_year.split(' ');
                    curr_month = curr_month_year[0];
                    curr_year = curr_month_year[1];
                } else if ($elem.is('ul div')) {
                    //console.log($elem);
                    var month_html = elem.innerHTML;
                    console.log(month_html);
                    var event_array = month_html.split('<' + 'br' + '>');
                    for(var i = 0; i < event_array.length; i++) {
                        var row = {};
                        event_array[i] = event_array[i].replace(" - ", " -- ");
                        var date_title = event_array[i].split('--');
                        row.title = date_title[1];
                        var month_day = date_title[0].split('/');
                        row.date = curr_month + " " + month_day[1] + " " + curr_year;
                        row.info = event_array[i];
                        row.external_id = row.date;
                        row.location = "Piedmont Piano, Oakland";
                        data.push(row);
                    }
                }
            });
            return data;
        }(jQuery);
    }
});
