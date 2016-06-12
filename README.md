# onee #

## Setup ##
#### Requirements ####
- Graphicsmagick
- gulp
- node
- mongodb
---
#### Steps ####
1. npm install
2. node server.js
3. in Node_modules/dhash/index.js
change this line
``var gm = require('gm').subClass({
                   	imageMagick: true
                   });
                   ``
to this:
``var gm = require('gm');``

#### UI Changes ####
The Ui is build with React and Redux for State,
after Changes to it the bundle.js has to be recreated,
to do that type gulp bundle in the project root or use gulp and let the filewatcher do its thing
