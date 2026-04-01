[app]
# (str) Title of your application
title = Rakobatna

# (str) Package name
package.name = rakobatna

# (str) Package domain (needed for android packaging)
package.domain = org.test

# (str) Source code where the main.py live
source.dir = .

# (list) Source files to include (let empty to include all the files)
source.include_exts = py,png,jpg,kv,atlas

# (str) Application versioning (method 1)
version = 0.1

# (list) Application requirements
# تأكد من إضافة كل المكتبات التي استخدمناها هنا
requirements = python3,kivy==2.2.1,kivymd==1.1.1,requests,feedparser,plyer,certifi

# (str) Supported orientations
orientation = portrait

# (list) Permissions
# أضفنا الكاميرا والموقع والإنترنت كما اتفقنا
android.permissions = INTERNET, CAMERA, ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION

# (int) Android API to use
android.api = 31

# (int) Minimum API your APK will support
android.minapi = 21

# (str) Android NDK version to use
android.ndk = 25b

# (bool) Use custom screen for loading
android.skip_update = False

# (list) List of Java .jar files to add to the libs so that pyjnius can access
# android.add_jars = foo.jar,bar.jar,path/to/baz.jar

# (list) List of Java files to add to the android project
# android.add_src = src/main/java/com/foo/bar.java

[buildozer]
# (int) Log level (0 = error only, 1 = info, 2 = debug (with command output))
log_level = 2

# (int) Display warning if buildozer is run as root (0 = off, 1 = on)
warn_on_root = 1