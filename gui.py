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
import json

from bottle import Bottle, run, template, static_file, route
from pprint import pprint
import urllib2 
import logging
import bottle
import os
import urlparse
from gzipper import Gzipper

root = os.path.dirname(os.path.abspath(__file__))
   
static_file_path = ''
api_path=''
context_path=''
graph_path=''

def setup(static_file_path_, api_path_, context_path_, graph_path_):
    global static_file_path, api_path, context_path, graph_path
    static_file_path = static_file_path_
    api_path = api_path_
    context_path = context_path_
    graph_path = graph_path_
   
    
    if not "http" in api_path:
        api_path_ = 'http://localhost' + api_path
    
    global url_status, url_logics, url_maps, url_config
    url_status = api_path_ + '/status'
    url_logics = api_path_ + '/logics'
    url_maps = api_path_ + '/maps'
    url_config = api_path_ + '/config'
    
def _render_template(name, **kwargs):
    global static_file_path, api_path
    return template(name, static_file_path=static_file_path, api_path=api_path, context_path=context_path, graph_path=graph_path, **kwargs)

def _set_room_id(maps):
    room_id=""
    for room in maps:
        if False is room['external']:
            room_id = room['id']
            break
    return room_id

   
@route('/')
def index():  
    ## Read device status and handle errors
    try:
        response = urllib2.urlopen(url_status)
        deviceStatus = json.loads(response.read())
    except urllib2.HTTPError:
        deviceStatus = 'Error'
    
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
    except urllib2.HTTPError:
        map = 'Error'
        
    return _render_template('main.tpl.html', deviceStatus=deviceStatus, map=map, url_status=url_status, url_logics=url_logics) 
  
@route('/room_selection') 
def roomsel(): 
    
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
        room_id = _set_room_id(map['maps'])  
    except urllib2.HTTPError:
        map = 'Error'
        room_id = ''
    
    try:
        response = urllib2.urlopen(url_status)
        deviceStatus = json.loads(response.read())
    except urllib2.HTTPError:
        deviceStatus = 'Error'   
   
    return _render_template('room_selection.tpl.html', room_name='' , map=map, room_id=room_id, deviceStatus=deviceStatus, url_status=url_status,url_logics=url_logics, url_maps=url_maps)

@route('/room_selection/<room_id>')
def roomdetails(room_id):
    ## Read device status
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
    except urllib2.HTTPError:
        map = 'Error'
        
    try:
        response = urllib2.urlopen(url_status)
        deviceStatus = json.loads(response.read())
    except urllib2.HTTPError:
        deviceStatus = 'Error'   
        

    return _render_template('room_selection.tpl.html', room_name='' , map=map, room_id=room_id, deviceStatus=deviceStatus, url_status=url_status,url_logics=url_logics, url_maps=url_maps) 
    
@route('/timer') 
def timer():  
    ## Read the home maps 
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
        room_id = _set_room_id(map['maps'])  
    except urllib2.HTTPError:
        map = 'Error'
        room_id = ''

    return _render_template('timer.tpl.html', operation = '' , map=map, room_id=room_id, url_status=url_status,url_logics=url_logics, url_maps=url_maps)   
      
@route('/timer/<room_id>') 
def timerdetail(room_id):     
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
    except urllib2.HTTPError:
        map = 'Error'

    return _render_template('timer.tpl.html', operation = '' , map=map, room_id=room_id,url_status=url_status,url_logics=url_logics, url_maps=url_maps)

@route('/timer/<room_id>/add') 
def timeadd(room_id): 
     try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
     except urllib2.HTTPError:
        map = 'Error'
        
     return _render_template('timer.tpl.html', operation = "add", map=map, room_id=room_id,url_status=url_status,url_logics=url_logics, url_maps=url_maps)

@route('/timer/<room_id>/edit/<checked>') 
def timeedit(room_id, checked): 
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
    except urllib2.HTTPError:
        map = 'Error'
    return _render_template('timer.tpl.html', operation = "edit" , map=map, room_id=room_id, checked=checked,url_status=url_status,url_logics=url_logics, url_maps=url_maps)
      
@route('/graphs')
def graphs():
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
    except urllib2.HTTPError:
        map = 'Error'
    
    try:
        response = urllib2.urlopen(url_status)
        deviceStatus = json.loads(response.read())
    except urllib2.HTTPError:
        deviceStatus = 'Error'
  
    return _render_template('graphs.tpl.html', map=map, room_id='', deviceStatus=deviceStatus) 
 
@route('/graphs/<room_id>')
def graphsdetail(room_id):      
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
    except urllib2.HTTPError:
        map = 'Error'
    
    try:
        response = urllib2.urlopen(url_status)
        deviceStatus = json.loads(response.read())
    except urllib2.HTTPError:
        deviceStatus = 'Error'
        
    return _render_template('graphs.tpl.html', map=map, room_id=room_id, deviceStatus=deviceStatus) 
 
@route('/costs')  
def costs(): 
    return _render_template('costs.tpl.html')

@route('/alerting')
def alerting(): 
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
        room_id = 'global_settings'
    except urllib2.HTTPError:
        map = 'Error'
        room_id = ''
        
    try:
        response = urllib2.urlopen(url_status)
        deviceStatus = json.loads(response.read())
    except urllib2.HTTPError:
        deviceStatus = 'Error'
    
    return _render_template('alerting.tpl.html', map=map, room_id=room_id, operation='', deviceStatus=deviceStatus)

@route('/alerting/<room_id>') 
def configdetail(room_id):    
    try:
        response = urllib2.urlopen(url_config)
        config_data = json.loads(response.read())
        config_data = config_data['config']
    
    except urllib2.HTTPError:
        config_data = 'Error'
        
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
    except urllib2.HTTPError:
        map = 'Error'
        
    try:
        response = urllib2.urlopen(url_status)
        deviceStatus = json.loads(response.read())
    except urllib2.HTTPError:
        deviceStatus = 'Error'
    
    return _render_template('alerting.tpl.html', operation = "", config_data=config_data, map=map, room_id=room_id, deviceStatus=deviceStatus)
     

@route('/alerting/<room_id>/edit/<config>') 
def configedit(room_id, config): 
    mail_to = ""
    sms_to = ""        
    try:
        response = urllib2.urlopen(url_config)
        config_data = json.loads(response.read())
        config_data = config_data['config']
        
        if config=='temp':
            alert_to = config_data['alert']['temperature_mail_to']
            
            for tmp in alert_to.split(', '):
                if tmp.startswith('+'):
                    sms_to = sms_to + ' ' + tmp
                else:
                    mail_to = mail_to + ' ' + tmp
        
        if config=='unable':
            alert_to = config_data['alert']['unable_mail_to']
            
            for tmp in alert_to.split(', '):
                if tmp.startswith('+'):
                    sms_to = sms_to + ' ' + tmp
                else:
                    mail_to = mail_to + ' ' + tmp
            
    except urllib2.HTTPError:
        config_data = 'Error'
        
    try:
        response = urllib2.urlopen(url_maps)
        map = json.loads(response.read())
    except urllib2.HTTPError:
        map = 'Error'
        
    try:
        response = urllib2.urlopen(url_status)
        deviceStatus = json.loads(response.read())
    except urllib2.HTTPError:
        deviceStatus = 'Error'

    return _render_template('alerting.tpl.html', operation = "edit", config = config, config_data=config_data, map=map, room_id=room_id, mail_to=mail_to, sms_to=sms_to, deviceStatus=deviceStatus)
      
@route('/support')
def support(): 
    return _render_template('support.tpl.html')
  
@route("/fonts/<filename>")  
def fontsfileget(filename):
    return static_file(filename, root=root + "/fonts/") 
 
@route("/css/<filename>")
def cssfileget(filename):  
    return static_file(filename, root= root + "/css/")
 
@route("/js/<filename>")
def jsfileget(filename):
    return static_file(filename, root=root + "/js/")

@route("/json/<filename>")
def jsjsonget(filename):
    return static_file(filename, root="json/")

@route("/images/<filename>")
def imgfileget(filename): 
    return static_file(filename, root=root + "/images/")

@route("/locales/dev/<filename>")
def translationdevget(filename):
    return static_file(filename, root=root + "/locales/dev/")

@route("/locales/it/<filename>")
def translationitget(filename):
    return static_file(filename, root=root + "/locales/it/")


APP_ROOT = root
bottle.TEMPLATE_PATH.append(os.path.join(APP_ROOT, 'templates'))
app = bottle.default_app()
