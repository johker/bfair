var FeedParser = require('feedparser')
  , request = require('request')
	, glct = 0


request('http://rss.betfair.com/RSS.aspx?format=rss&sportID=7&countryID=9999')
  .pipe(new FeedParser({}))
  .on('error', function(error) {
    // always handle errors
    console.log(error);
  })
  .on('meta', function (meta) {
    // do something
    console.log('meta');
  })
  .on('readable', function () {
  	 var stream = this, item;
                while (item = stream.read()){
                    var result = {
                        'title': item.title,
                        'summary': item.summary                        
                    };
                    glct++;
                    
                }
               console.log(result); 
  })