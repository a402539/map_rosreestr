import urllib.request, os, time

timenow = time.time()
print('Beginning file download with urllib2...')
z = 9
zz = 2**z
M = 40075016.686
prefix = '/Users/Lenovo/Downloads/'
for x in range(0,zz):
    for y in range(0,zz):
        url = 'https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/ZONES/MapServer/export?layers=show%3A1&dpi=96&format=PNG32&bbox='+\
        str(M*(x/zz-1/2))+','+str(M*(1/2-(y+1)/zz))+','+str(M*((x+1)/zz-1/2))+','+str(M*(1/2-y/zz))+\
        '&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image'
        urllib.request.urlretrieve(url, prefix+'tmp.png')
        size = os.stat(prefix+'tmp.png').st_size
        if size > 6527:
            if not os.path.exists(prefix+str(z)):
                os.makedirs(prefix+str(z))
            if not os.path.exists(prefix+str(z)+'/'+str(x)):
                os.makedirs(prefix+str(z)+'/'+str(x))
            os.replace(prefix+'tmp.png',prefix+str(z)+'/'+str(x)+'/'+str(y)+'.png')
            print(z,x,y,size)
    print(z, x, time.time()-timenow,'сек')
