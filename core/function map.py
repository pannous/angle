import inspect
import sys
import collections
import importlib
h={}
done={}
count = collections.defaultdict(list)
print(sys.modules.keys())
modules=sys.modules.keys()
modules=['os', 'os.path', 'thread', 'keyword', 'StringIO','signal', 'traceback', 'linecache', 'itertools',  'exceptions', 'collections', 'sys','string','__future__','strop','interpy.codec.six', 'heapq',  'copy_reg', 'sre_compile', '_collections', 'interpy.codec.utils', '_sre', 'functools', 'encodings', 'site', '__builtin__', 'sysconfig', 'google', '__main__', 'operator', 'encodings.encodings', 'mpl_toolkits', '_heapq', 'abc', 'posixpath', '_weakrefset', 'errno', 'interpy.codec.tokenize', 'six', 'encodings.codecs', 'sre_constants', 'PyObjCTools', 're', '_abcoll', '_functools', 'types', 'interpy.codec', '_codecs', 'encodings.__builtin__', 'opcode', '_warnings', 'interpy.codec.__future__', 'genericpath', 'stat', 'zipimport', '_sysconfigdata',  'inspect', 'warnings', 'UserDict', 'tokenize', 'interpy.codec.register',  'interpy.codec.tokenizer', '_osx_support', 'imp', 'codecs', 'interpy.codec.codecs',  'interpy', '_locale', 'sitecustomize',  'interpy.codec.encodings', 'posix', 'encodings.aliases','sre_parse', 'interpy.codec.sys', '_weakref', 'token', 'dis'] # SORTED!
print(len(modules))
mo_modules=['yaml','requests','Theano','numpy','debugger','BeautifulSoup','PyAudio','protobuf','altgraph','argparse','ast','ast2json','asteval','astor','awscli','backports.ssl','bcdoc','bdist','beautifulsoup4','benchmarks','bonjour','botocore','catkin','certifi','climate','codegen','colorama','coloredlogs','configobj','cssselect','debugger','decorator','dnspython','docopt','docutils','downhill','enum','enum34','execnet','forbiddenfruit','fortune','friture','funcsigs','functools3','functools32','gensim','gevent','glumpy','greenlet','grizzled','gunicorn','h5py','howdoi','humanfriendly','ino','interpy','ipython','itsdangerous','jedi','jmespath','joblib','jsonschema','leveldb','lmj.rbm','lockfile','lolcat','lxml','macholib','matplotlib','mercurial','mftracker','mock','modulegraph','mutagen','neon','networkx','nltk','nose','numba','numpy','numpydoc','opencl','ordereddict','panda','pandas','paramiko','pathlib','pip','plac','poster','protobuf','psutil','py','py2app','pyOpenSSL','pyOpenTLD','pyasn','pyasn1','pycocotools','pyenchant','pygpu','pylint','pyobjc','pyopencl','pyparsing','pyqtgraph','pyquery','pyserial','pytest','python','pytools','pytz','pyzmq','qtutils','rbm.py','requests','rosdep','rosdistro','rosinstall','rospkg','rsa','scikit','scikits.audiolab','scikits.cuda','scipy','selenium','setuptools','shedskin','six','skdata','sleekxmpp','stem','swg','theanets','theano','thefuck','tornado','tox','uTidylib','unittest','unittest2','vcstools','virtualenv','word','word2vec','wsgiref','wstool','xattr','zope.interface','Cython','DeepCL','Flask','Jinja','Jinja2','Keras','Mako','MarkupSafe','PIL','PyAudio','PyOpenGL','PyYAML','Pygments','SimpleCV','SimpleConvnet','SpeechRecognition','Sphinx','Theano','Twisted','Unirest','ViTables','Werkzeug','sklearn']
# PredictionIO
ignoreModules=['h5py','pyqtgraph','lmj.rbm','sre_compile','sre_parse','nltk','scikit','Pillow']#'scipy',sklearn Pillow=PIL
for m in modules+mo_modules:
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
        # if inspect.isclass(obj):
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
        count[name].append(m)

for k,v in count.items():
    if len(v)>1:
        print("Ambiguous "+k+" %s"%",".join(v))
        continue
    print(k+"   "+h[k])

#['pyobjc','pyobjc-core','pyobjc-framework-Accounts','pyobjc-framework-AddressBook','pyobjc-framework-AppleScriptKit','pyobjc-framework-AppleScriptObjC','pyobjc-framework-Automator','pyobjc-framework-CalendarStore','pyobjc-framework-CFNetwork','pyobjc-framework-Cocoa','pyobjc-framework-Collaboration','pyobjc-framework-CoreData','pyobjc-framework-CoreLocation','pyobjc-framework-CoreText','pyobjc-framework-CoreWLAN','pyobjc-framework-DictionaryServices','pyobjc-framework-DiskArbitration','pyobjc-framework-EventKit','pyobjc-framework-ExceptionHandling','pyobjc-framework-FSEvents','pyobjc-framework-InputMethodKit','pyobjc-framework-InstallerPlugins','pyobjc-framework-InstantMessage','pyobjc-framework-LatentSemanticMapping','pyobjc-framework-LaunchServices','pyobjc-framework-PreferencePanes','pyobjc-framework-PubSub','pyobjc-framework-QTKit','pyobjc-framework-Quartz','pyobjc-framework-ScreenSaver','pyobjc-framework-ScriptingBridge','pyobjc-framework-SearchKit','pyobjc-framework-ServiceManagement','pyobjc-framework-Social','pyobjc-framework-StoreKit','pyobjc-framework-SyncServices','pyobjc-framework-SystemConfiguration','pyobjc-framework-WebKit']
