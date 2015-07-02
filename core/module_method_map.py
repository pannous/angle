import inspect
import sys
import collections
import importlib
import the

try:
   import cPickle as pickle
except:
   import pickle
# import the
import yaml

h={}
done={}
the.methodToModulesMap = collections.defaultdict(list)
the.moduleMethods = collections.defaultdict(list)
the.moduleClasses = collections.defaultdict(list)
# the.classToModulesMap = collections.defaultdict(list)
# count = yaml.load(open("data/module_methods.yml")) # 2sec, too slow!!
# count = pickle.load(open("data/module_methods.bin"))
# print(count)
# exit()
# print(sys.modules.keys()) # SORTED :
modules=['os', 'os.path', 'thread', 'keyword', 'StringIO','signal', 'traceback', 'linecache', 'itertools',  'exceptions', 'collections', 'sys','string','__future__','strop','interpy.codec.six', 'heapq',  'copy_reg', 'sre_compile', '_collections', 'interpy.codec.utils', '_sre', 'functools', 'encodings', 'site', '__builtin__', 'sysconfig', 'google', '__main__', 'operator', 'encodings.encodings', 'mpl_toolkits', '_heapq', 'abc', 'posixpath', '_weakrefset', 'errno', 'interpy.codec.tokenize', 'six', 'encodings.codecs', 'sre_constants', 'PyObjCTools', 're', '_abcoll', '_functools', 'types', 'interpy.codec', '_codecs', 'encodings.__builtin__', 'opcode', '_warnings', 'interpy.codec.__future__', 'genericpath', 'stat', 'zipimport', '_sysconfigdata',  'inspect', 'warnings', 'UserDict', 'tokenize', 'interpy.codec.register',  'interpy.codec.tokenizer', '_osx_support', 'imp', 'codecs', 'interpy.codec.codecs',  'interpy', '_locale', 'sitecustomize',  'interpy.codec.encodings', 'posix', 'encodings.aliases','sre_parse', 'interpy.codec.sys', '_weakref', 'token', 'dis'] # SORTED!
print(len(modules))
mo_modules=['yaml','requests','Theano','numpy','debugger','BeautifulSoup','PyAudio','cv','cv2','protobuf','altgraph','argparse','ast','ast2json','asteval','astor','awscli','backports.ssl','bcdoc','bdist','beautifulsoup4','benchmarks','bonjour','botocore','catkin','certifi','climate','codegen','colorama','coloredlogs','configobj','cssselect','debugger','decorator','dnspython','docopt','docutils','downhill','enum','enum34','execnet','forbiddenfruit','fortune','friture','funcsigs','functools3','functools32','gensim','gevent','glumpy','greenlet','grizzled','gunicorn','h5py','howdoi','humanfriendly','ino','interpy','ipython','itsdangerous','jedi','jmespath','joblib','jsonschema','leveldb','lmj.rbm','lockfile','lolcat','lxml','macholib','matplotlib','mercurial','mftracker','mock','modulegraph','mutagen','neon','networkx','nltk','nose','numba','numpy','numpydoc','opencl','ordereddict','panda','pandas','paramiko','pathlib','pip','plac','poster','protobuf','psutil','py','py2app','pyOpenSSL','pyOpenTLD','pyasn','pyasn1','pycocotools','pyenchant','pygpu','pylint','pyobjc','pyopencl','pyparsing','pyqtgraph','pyquery','pyserial','pytest','python','pytools','pytz','pyzmq','qtutils','rbm.py','requests','rosdep','rosdistro','rosinstall','rospkg','rsa','scikit','scikits.audiolab','scikits.cuda','scipy','selenium','setuptools','shedskin','six','skdata','sleekxmpp','stem','swg','theanets','theano','thefuck','tornado','tox','uTidylib','unittest','unittest2','vcstools','virtualenv','word','word2vec','wsgiref','wstool','xattr','zope.interface','Cython','DeepCL','Flask','Jinja','Jinja2','Keras','Mako','MarkupSafe','PIL','PyAudio','PyOpenGL','PyYAML','Pygments','SimpleCV','SimpleConvnet','SpeechRecognition','Sphinx','Theano','Twisted','Unirest','ViTables','Werkzeug','sklearn']
all_modules=["CoreFunctions", "audioop", "matplotlib", "pydevd_vm_type", "HelperMethods", "base64", "mimetypes", "pydevd_xml", "IN", "bdb", "mmap", "pydoc", "Interpretation", "binascii", "modulefinder", "pydoc_data", "TreeBuilder", "binhex", "multiprocessing", "pyexpat", "__future__", "bisect", "netrc", "pylab", "_ast", "builtins", "nis", "pyparsing", "_bisect", "bz2", "nntplib", "pytz", "_bootlocale", "cProfile", "nodes", "queue", "_bz2", "calendar", "nose", "quopri", "_codecs", "cgi", "ntpath", "random", "_codecs_cn", "cgitb", "nturl2path", "re", "_codecs_hk", "chunk", "numbers", "readline", "_codecs_iso2022", "cmath", "numpy", "reprlib", "_codecs_jp", "cmd", "opcode", "resource", "_codecs_kr", "code", "operator", "rlcompleter", "_codecs_tw", "codecs", "optparse", "runfiles", "_collections", "codeop", "os", "runpy", "_collections_abc", "collections", "parser", "sched", "_compat_pickle", "colorsys", "pathlib", "scipy", "_crypt", "compileall", "pdb", "select", "_csv", "concurrent", "pickle", "selectors", "_ctypes", "configparser", "pickletools", "setuptools", "_ctypes_test", "contextlib", "pip", "shelve", "_curses", "copy", "pipes", "shlex", "_curses_panel", "copyreg", "pkg_resources", "shutil", "_datetime", "crypt", "pkgutil", "signal", "_dbm", "csv", "platform", "site", "_decimal", "ctypes", "plistlib", "six", "_dummy_thread", "curses", "poplib", "skimage", "_elementtree", "datetime", "posix", "sklearn", "_functools", "dateutil", "posixpath", "smtpd", "_hashlib", "dbm", "power_parser", "smtplib", "_heapq", "decimal", "pprint", "sndhdr", "_imp", "difflib", "profile", "socket", "_io", "dis", "pstats", "socketserver", "_json", "distutils", "pty", "sqlite3", "_locale", "doctest", "pwd", "sre_compile", "_lsprof", "dummy_threading", "py_compile", "sre_constants", "_lzma", "easy_install", "pyclbr", "sre_parse", "_markerlib", "email", "pycompletion", "ssl", "_markupbase", "encodings", "pycompletionserver  stat", "_md5", "english_parser", "pydev_app_engine_debug_startup statistics", "_multibytecodec", "english_tokens", "pydev_console_utils string", "_multiprocessing", "ensurepip", "pydev_coverage", "stringprep", "_opcode", "enum", "pydev_import_hook   struct", "_operator", "errno", "pydev_imports", "subprocess", "_osx_support", "events", "pydev_ipython", "sunau", "_pickle", "exceptions", "pydev_ipython_console symbol", "_posixsubprocess", "extensions", "pydev_ipython_console_011 symtable", "_pydev_completer", "faulthandler", "pydev_localhost", "sys", "_pydev_filesystem_encoding fcntl", "pydev_log", "sysconfig", "_pydev_getopt", "ffruit", "pydev_monkey", "syslog", "_pydev_imports_tipper filecmp", "pydev_monkey_qt", "t", "_pydev_imps", "fileinput", "pydev_override", "tabnanny", "_pydev_jy_imports_tipper fix_getpass", "pydev_pysrc", "tarfile", "_pydev_jython_execfile fnmatch", "pydev_run_in_console telnetlib", "_pydev_log", "forbiddenfruit", "pydev_runfiles", "tempfile", "_pydev_threading", "formatter", "pydev_runfiles_coverage termios", "_pydev_tipper_common fractions", "pydev_runfiles_nose test", "_pyio", "ftplib", "pydev_runfiles_parallel test_debug", "_random", "functools", "pydev_runfiles_parallel_client textwrap", "_scproxy", "gc", "pydev_runfiles_pytest2 third_party", "_sha1", "genericpath", "pydev_runfiles_unittest this", "_sha256", "getopt", "pydev_runfiles_xml_rpc threading", "_sha512", "getpass", "pydev_umd", "time", "_sitebuiltins", "gettext", "pydev_versioncheck  timeit", "_socket", "glob", "pydevconsole", "tkinter", "_sqlite3", "grp", "pydevconsole_code_for_ironpython token", "_sre", "gzip", "pydevd", "tokenize", "_ssl", "hashlib", "pydevd_additional_thread_info trace", "_stat", "heapq", "pydevd_breakpoints  traceback", "_string", "hmac", "pydevd_comm", "tracemalloc", "_strptime", "html", "pydevd_console", "treenode", "_struct", "http", "pydevd_constants", "tty", "_symtable", "idlelib", "pydevd_custom_frames turtle", "_sysconfigdata", "imaplib", "pydevd_dont_trace   turtledemo", "_testbuffer", "imghdr", "pydevd_exec", "types", "_testcapi", "imp", "pydevd_exec2", "unicodedata", "_testimportmultiple importlib", "pydevd_file_utils   unittest", "_thread", "inspect", "pydevd_frame", "urllib", "_threading_local", "interpreterInfo", "pydevd_frame_utils  uu", "_tkinter", "io", "pydevd_import_class uuid", "_tracemalloc", "ipaddress", "pydevd_io", "venv", "_warnings", "itertools", "pydevd_plugin_utils warnings", "_weakref", "json", "pydevd_plugins", "wave", "_weakrefset", "keyword", "pydevd_psyco_stub   weakref", "abc", "lib2to3", "pydevd_referrers", "webbrowser", "aifc", "linecache", "pydevd_reload", "wsgiref", "angel", "locale", "pydevd_resolver", "xdrlib", "antigravity", "logging", "pydevd_save_locals  xml", "argparse", "lzma", "pydevd_signature", "xmlrpc", "array", "macpath", "pydevd_stackless", "xxlimited", "ast", "macurl2path", "pydevd_trace_api", "xxsubtype", "asynchat", "mailbox", "pydevd_traceproperty zipfile", "asyncio", "mailcap", "pydevd_tracing", "zipimport", "asyncore", "marshal", "pydevd_utils", "zlib", "atexit", "math", "pydevd_vars"]
# PredictionIO
all_modules=modules+mo_modules+all_modules
ignoreModules=['h5py','pyqtgraph','lmj.rbm','sre_compile','sre_parse','nltk','scikit','Pillow']#'scipy',sklearn Pillow=PIL
pickle.dump(all_modules,open("data/module_names.bin","w"))
yaml.dump(all_modules,open("data/module_names.yml","w"))
# exit()
for m in all_modules:
    if m[0]=="_":continue
    if m in ignoreModules: continue
    try:
        # print("TRYING MODULE "+m)
        importlib.import_module(m)
        module = sys.modules[m]
    except:
        try:
            m=m.lower()
            print("TRYING MODULE "+m)
            importlib.import_module(m)
            module = sys.modules[m]
        except:
            try:
                m=m.replace("py","")
                print("TRYING MODULE "+m)
                importlib.import_module(m)
                module = sys.modules[m]
            except:
                print("!!!NO MODULE "+m)
                continue
    print("GOT MODULE "+m)


    if not module :continue
    if m in done:continue
    done[m]=True
    # print( dir(inspect))
    # help(module )
    ignoreNames=["error","sys","os","string","types","call","version"] # attrgetter operator,inspect,pathlib !?
# cv2.__version__  MAP !!
    for name, obj in inspect.getmembers(module):
        if name[0]=="_":continue
        if name in ignoreNames and m!="os":continue
        if name.isupper():continue
        if inspect.isclass(obj):
            the.moduleClasses[m].append(name)
            the.moduleClasses[name].append(m)#odule) # Use bidirectionally
            # the.classToModulesMap[name].append(m)#odule)
            continue
        #     print(inspect.getclasstree(obj))
        #     exit()
    # for x in inspect.getmembers(m)+dir(m):
        # print(m+"   "+str(x))
        # name = x[0]
        if name in h:
            if h[name]=="os":continue
            # KEEP ALL! use default lookup for some [os,path,sys,...] AND/OR
            # singles serve: astor.xyz  ... dump [yaml,ast,astor,joblib] => astor.dump !!
            # exception if truly ambiguous: astor.xyz yaml.xyz ... dump [yaml,ast,astor,joblib] => exception/ask!
            # compile re, theano UH, DON'T MIX! or CHECK TYPE! compile /regex/ OK!
            # add operator,numpy  numpy>operator or CONTEXT OK ^^

# PROBLEMATIC / RESERVED:
    # Dict ast,docopt Expr ast,pandas CASE IMPORTANT != dict !!! ALL AST!
               # version sys,numpy,enum,funcsigs etc etc
    # exit thread,sys !!
    # struct shedskin,virtualenv <>><>
# Ambiguous copy numpy,coloredlogs
#             Ambiguous invert operator,numpy
# Ambiguous external networkx,rosdistro
# Ambiguous case nose,unittest
# Ambiguous datetime itsdangerous,panda,pandas,pytz
# Ambiguous class_types six,nltk
# Ambiguous where numpy,certifi
# Ambiguous test StringIO,numpy,matplotlib,networkx,opencl,psutil,scikits.audiolab,theano
# Ambiguous main keyword,tokenize,token,fortune,nose,pip,shedskin,theanets,unittest,virtualenv
# Ambiguous delete requests,numpy
# Ambiguous save numpy,pandas
# Ambiguous any tokenize,numpy,pytools
# Ambiguous numpy glumpy,matplotlib,nltk,theano !?!?!
# Ambiguous result nose,unittest
# Ambiguous re inspect,tokenize,debugger ???
# Ambiguous exceptions requests,jmespath,jsonschema,pip,pytz,sleekxmpp
# Ambiguous e sitecustomize,numpy
# Ambiguous long numpy,psutil
# Ambiguous math numpy,humanfriendly,mftracker
# Ambiguous function networkx,theano
# Ambiguous callable six,psutil
# Ambiguous add operator,numpy
# Ambiguous constructor copy_reg,yaml
# Ambiguous key matplotlib,rsa
# OK?
# Ambiguous put requests,numpy OK?
# Ambiguous info numpy,networkx,pandas

            if m=="pygpu":continue # numpy CONTEXT!
            if m=="Cython":continue # numpy CONTEXT!
            if m=="pyopencl":continue # opencl OK??
            if m=="unittest2":continue # unittest OK??
            if m=="codegen":continue # ast OK??
            if m=="pyparsing":continue # ast OK??
            if m=="scipy":continue # numpy
            if m=="opcode":continue # string
            if m=="dis":continue # string
            if m=="site":continue # Site-specific configuration hook This module is automatically imported during initialization.
            if m=="strop":continue # string
            if m=="posix":continue # os
            if m=="sre_compile":continue # 	# Secret Labs' Regular Expression Engine !?
            if m=="operator":continue # USEFULL!!! built-in operators is_not(a,b) ... !  gt(a, b)  add(a, b) or_(c, d)
            if m=="encodings.aliases":continue # encodings
            if m=="heapq":continue # heapq!? operator
            if m=="six":continue #Six is a Python 2 and 3 compatibility library.
            if m=="posixpath":continue # os.path
            if m=="genericpath":continue # os.path
            if m=="sysconfig":continue # os.path
            if m=="interpy.codec":continue # codecs
            if m=="interpy.codec.register":continue # codecs
            if m=="interpy.codec.tokenizer":continue # .tokenize
            if m=="interpy.codec.utils":continue # ['next', 'six'] wtf
            # print("ambiguous "+name+" %s"%",".join(count[name]))
        else:
            h[name]=m
        the.methodToModulesMap[name].append(m)
        the.moduleMethods[m].append(name)

for k,v in the.methodToModulesMap.items():
    if len(v)>1:
        print("Ambiguous "+k+" %s"%",".join(v))
        continue
    print(k+"   "+h[k])

yaml.dump(the.methodToModulesMap,open("data/method_modules.yml","w"))
pickle.dump(the.methodToModulesMap,open("data/method_modules.bin","w"))
#
yaml.dump(the.moduleMethods,open("data/module_methods.yml","w"))
pickle.dump(the.moduleMethods,open("data/module_methods.bin","w"))

yaml.dump(the.moduleClasses,open("data/module_classes.yml","w"))
pickle.dump(the.moduleClasses,open("data/module_classes.bin","w"))

#['pyobjc','pyobjc-core','pyobjc-framework-Accounts','pyobjc-framework-AddressBook','pyobjc-framework-AppleScriptKit','pyobjc-framework-AppleScriptObjC','pyobjc-framework-Automator','pyobjc-framework-CalendarStore','pyobjc-framework-CFNetwork','pyobjc-framework-Cocoa','pyobjc-framework-Collaboration','pyobjc-framework-CoreData','pyobjc-framework-CoreLocation','pyobjc-framework-CoreText','pyobjc-framework-CoreWLAN','pyobjc-framework-DictionaryServices','pyobjc-framework-DiskArbitration','pyobjc-framework-EventKit','pyobjc-framework-ExceptionHandling','pyobjc-framework-FSEvents','pyobjc-framework-InputMethodKit','pyobjc-framework-InstallerPlugins','pyobjc-framework-InstantMessage','pyobjc-framework-LatentSemanticMapping','pyobjc-framework-LaunchServices','pyobjc-framework-PreferencePanes','pyobjc-framework-PubSub','pyobjc-framework-QTKit','pyobjc-framework-Quartz','pyobjc-framework-ScreenSaver','pyobjc-framework-ScriptingBridge','pyobjc-framework-SearchKit','pyobjc-framework-ServiceManagement','pyobjc-framework-Social','pyobjc-framework-StoreKit','pyobjc-framework-SyncServices','pyobjc-framework-SystemConfiguration','pyobjc-framework-WebKit']
# pickle.dump(modules,"")
