Instructions on installing and run chatclient.

Requierments
node.js and npm package manager has to be installed on the computer and git also.
If bower is not installed, give the command npm install -g bower.

Installing: ( install.bat / install.sh will make next step automaticly )

From the pa2 directory, give this commands on the command promt in this order
npm install
bower install
grunt

To run chatserver on port 8080 give this command:
node chatserver.js

To serve this chatclient on port 8000 give this command:
grunt connect

Open your browser and go to localhost:8000.
