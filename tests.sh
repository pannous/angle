cd $ANGLE_HOME
export PYTHONPATH=
export PYTHONPATH=$PYTHONPATH:./angle/
export PYTHONPATH=$PYTHONPATH:./tests/
export PYTHONPATH=$PYTHONPATH:./kast/

export TESTING=1
# cd angle
# py.test ../tests
# python3 -m pytest ../tests

# see pytest.ini
if [[ "$@" = '2' ]]; then
	python2 -m pytest --runxfail --disable-warnings tests
# elif  [[ "$@" = 'p' ]];
# 	pypy3 -m pytest --runxfail --disable-warnings tests
else
	python3 -m pytest --runxfail --disable-warnings tests
fi