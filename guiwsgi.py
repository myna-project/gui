#-------------------------------------------------------------------------------
# Copyright (c) 2014 Proxima Centauri srl <info@proxima-centauri.it>.
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the GNU Public License v3.0
# which accompanies this distribution, and is available at
# http://www.gnu.org/licenses/gpl.html
# 
# Contributors:
#     Proxima Centauri srl <info@proxima-centauri.it> - initial API and implementation
#-------------------------------------------------------------------------------
#!/usr/bin/python
# -*- coding: utf-8 -*-


from bottle import route, run, request, abort, static_file, template, default_app
import bottle
from gui import *
from gzipper import Gzipper

# set up the application path
# first the static file path 
# the second the api path
setup('/static/gui', "/api", "/gui/", "/rrd/graph/")

app = Gzipper(app, content_types=set(['text/plain', 'text/html', 'text/css',
'application/json', 'application/x-javascript', 'text/xml', 'application/javascript',
'application/xml', 'application/xml+rss', 'text/javascript',
'image/svg', 'image/svg+xml'])) 

if __name__ == '__main__':
    from flup.server.fcgi import WSGIServer
    WSGIServer(app,  multithreaded=False).run()

