# -*- coding: utf-8 -*-
import requests

url = '阿里云函数域名'

def handler(event, context):
  req = requests.get(url + '/everydaynum')

  return 'req'