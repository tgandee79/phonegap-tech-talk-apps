phonegap-tech-talk-apps
=======================


##Apps

###Camera

This app allows you take a photo with iPhone camera, render it to a canvas object, and draw over the image.  There is a clear button to clear the canvas and take another photo.

This is a simple example that used the Cordova Camera Plugin.

Repo: https://github.com/apache/cordova-plugin-camera.git

Pen Tool for canvas:
http://www.codeproject.com/Articles/355230/HTML-5-Canvas-A-Simple-Paint-Program-Touch-and-Mou

###MapKit

This app is an example that uses the MapKit Plugin (https://github.com/imhotep/MapKit.git).  The built example is from the plugin repo.


##How these were built
  - Install Phonegap and Cordova
    `
      npm install -g phonegap
      npm install -g cordova
    `

  - Using `phonegap` cli, in the `apps` directory type:

    `
      phonegap create [directory projectName] [com.namespace.appname] [appName]
    `
    example:

    `
      phonegap create mapKit com.tgandee.mapKit MapKit
    `

  - Change Directory to the projectName

    `
      cd [directory projectName]
    `

  - Add Native Platform(s)

    `
      phonegap install ios
      phonegap install android
    `

  - Add Plugin(s) with phonegap cli:

    `
      phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git

    `

  - Add Plugin(s) with cordova cli:

    `
      cordova plugin add org.apache.cordova.camera
    `

  - Add application code:
    In the directory, `www/js/`, find `index.js`.  the method `onDeviceReady` is what is run when the phonegap native application is ready and has loaded the HTML App in the WebView.  This event is much like jquery's $(document).ready(f(){}); Any code that needs to call the native phonegap wrapper, needs to happen after this initial event. If your app has an `init` method, run that here.  Any loading screens should run by default, until this event is fired.

  - Build and Test

    `
      phonegap local build ios
    `

    This will create the application and transfer all necessary files to the `platform` directory for the appropriate platform specified after the build statement.


