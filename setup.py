from __future__ import print_function

import warnings
from setuptools import setup, find_packages, Extension
from setuptools.command.install import install

class angle_install(install):
    def run(self):
        print("please type `install`.\n")
        mode = None
        return install.run(self)

cmdclass = {}
ext_modules = []
cmdclass.update({'install': angle_install})

setup(
    cmdclass=cmdclass,
    ext_modules=ext_modules,
    name='angle',
    version='0.1.4',
    author="Pannous",
    author_email="info@pannous.com",
    packages=find_packages(),
    description='Angle : speakable programming language compiling to python bytecode',
    license='Apache2 license',
    long_description=open('README.md', 'rb').read().decode('utf8'),
    dependency_links=['git+http://github.com/pannous/context.git#egg=angle'],
    install_requires=['astor', 'pyyaml', 'argparse', "stem"],
    scripts=['bin/angle'],
    package_data={
        # '': ['*.cu', '*.cuh', '*.h'],
    },
)
