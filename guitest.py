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

# configure host

from bottle import run
import bottle
from gui import *

setup('', "http://10.10.10.196:8000", "/gui/", "http://10.10.10.42/rrd/graph/")

bottle.debug(True)

app2 = bottle.default_app() 

app2.mount(prefix="/gui/", app=app)

# start the application
run(app2, host='0.0.0.0', port=10000, reloader=True)
