import urllib2
import json

def ping(url):
	if url.contains("http"):
		url=url.remove("http.?//")

def download(url):
    data = urllib2.urlopen(url).read()  # download
    return data
    # data = json.loads(data)

