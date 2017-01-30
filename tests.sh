cd $ANGLE_HOME
export PYTHONPATH=$PYTHONPATH:./angle/:./kast/:./tests/
export TESTING=1
# cd angle
# py.test ../tests
# python3 -m pytest ../tests
python3 -m pytest tests
# python2 -m pytest tests