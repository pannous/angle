#!/usr/bin/env bash
echo INSTALLING DEPENDENCIES... This might take a minute or 10

#git submodule foreach init
git submodule foreach git pull origin master

export ANGLE_HOME=$PWD
echo export ANGLE_HOME=$PWD
echo source ./install.sh
echo "export ANGLE_HOME=$PWD" >> ~/.bashrc

sudo ln -s $ANGLE_HOME/bin/angle /usr/local/bin/angle

echo "Installing Python requirements"
echo pip2/pip3 install -r requirements.txt
pip2 install -r requirements.txt
pip3 install -r requirements.txt

python3 setup.py build 
sudo python3 setup.py install

if [[ "$OSTYPE" == 'darwin' ]]; then
	echo "Adding TextMate support, like syntax highlighting"
	git clone git@github.com:pannous/EnglishScript.tmbundle.git ~/Library/Application\ Support/TextMate/Bundles/EnglishScript.tmbundle/ 2>/dev/null
fi

echo "OK, now run ./bin/angle"
./bin/angle
