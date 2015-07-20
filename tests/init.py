from discover import DiscoveringTestLoader


def get_tests():
    start_dir = os.path.dirname(__file__)
    test_loader = DiscoveringTestLoader()
    return test_loader.discover(start_dir, pattern="*_test.py")

# import os.path
# import unittest
# 
# def get_tests():
#     start_dir = os.path.dirname(__file__)
#     return unittest.TestLoader().discover(start_dir, pattern="*_test.py")