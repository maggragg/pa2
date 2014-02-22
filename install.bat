echo "Installing everything for this to work..." 
npm install
echo "grunt tasks installed - installing bower components..."
bower install
echo "Bower components installed - running grunt..."
grunt
echo "Done!"
