Couple of bugs seen here:
  1) The default connection here is the WebSerialAPI which will always lead to Errors on unsupported devices. Best way is to possibly change this to be defaulted to BT connection, and if, WebSerialAPI is supported, set a flag, causing the user to select which connectivity to use.
  2) Introduce an end session button to disconnect, which will re-enable the connect button. This connect button will be mapped to the "Device Scan" button the normal web-app.  
