# encoding=utf8  
import sys
py3=sys.version >= '3'
py2=sys.version < '3'
if py2:
	import sys  
	reload(sys)  
	sys.setdefaultencoding('utf8')
# >>> sys.getdefaultencoding()
# 'utf8'