# Gui 

The application contain the main gui of myna products.

The gui is a bottle application and can started with the python script 
* guidev.py - start the api using the internal server of bottle 
* guiwsgi.py - wsgi version of script (tested on lighttpd)

Note: the guiwsgi.py must be mapped to http://<ip_address>/gui

## Requirements 

* Raspbian
* lighttpd
* python 2.7 

## Libraries 
The application uses the following libraries

* bootstrap.min.js 3.1.0 http://getbootstrap.com/
* Bootstrap Timepicker 0.2.6 http://jdewit.github.io/bootstrap-timepicker/
* i18next 1.7.3 http://i18next.com/
* jquery 1.11.0 http://jquery.com/
* moment 2.0.0 http://momentjs.com/

* python-bottle 0.10.11 http://bottlepy.org/