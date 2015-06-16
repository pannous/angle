#!/usr/bin/env PYTHONIOENCODING=utf-8 python
import pydevd
#pydevd.settrace('localhost', port=8888, stdoutToServer=True, stderrToServer=True)
pydevd.settrace('iMac.local', port=8888, stdoutToServer=True, stderrToServer=True)
print "hi"
print "ho"
