# EPL Web Scraper

NodeJS Application to scrape the BBC Football website and collect basic information:

* League table
* All match result information
* Future match schedule information

More coming soon.


## Routes

* /api/teams - list all teams (id, name, points, fixtures(?))
* /api/teams/{teamId} - team information (id, name, points, fitures(?))
* /api/teams/{teamId}/fixtures - all fixtures in the future
* /api/teams/{teamId}/results - all fixtures in the past
