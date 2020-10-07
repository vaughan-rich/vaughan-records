# 📀 [It's funky and it's low volume.](https://www.youtube.com/watch?v=AWBUnr0F3Zo)

[Vaughan Records](https://www.richvaughan.co.uk) is a simple website with a daily music recommendation.

![Cory Wong](coryWong.gif)

## How it works:

* Python code, scheduled daily via [WayScript](http://www.wayscript.com), pulls metadata for releases in my [Discogs](http://www.discogs.com) collection, using the [Discogs API](http://www.discogs.com/developers). The code also pushes data into a Google Sheet, using the [Sheets API](http://developers.google.com/sheets/api). In order for this to work, you need to supply credentials in a JSON file which you [generate in the GCP console](http://cloud.google.com/iam/docs/creating-managing-service-account-keys). *Aside: You can also use the Google Sheet as a data source for a personal [Data Studio](http://datastudio.google.com) dashboard (to keep track of your collection etc).*
* Google AppScript, scheduled daily using a time-driven trigger, clears the site's MySQL database, then pulls a single random row from the Google Sheet, and inserts it into the database. Data is hex-encoded to avoid any syntax errors in the SQL queries.
* PHP script pulls data from the database, and JS decodes it and inserts it into website HTML.

## In v3:
* New design - using [bootstrap](https://getbootstrap.com).

## In v2:
* Style changes and [animate.css](https://animate.style) animations
* Added cookie consent banner, with [Google Tag Manager](https://marketingplatform.google.com/intl/en_uk/about/tag-manager/) and [Google Analytics](https://marketingplatform.google.com/intl/en_uk/about/analytics/).

## In Future Versions:
* Add functionality in AppScript to notify me by email that the code has run successfully (as is already set up in WayScript).
* Bug fixes / testing

## Credits:
* I use the code described [here](http://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex/26375459) to encode/decode to/from hexadecimal.
* [The birth of Vulf Mono](https://ohnotype.co/blog/the-process-of-vulf-mono).


