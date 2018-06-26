// Gesture Recognized Control App via applescript
function GestureControlApps(index_dollar_reco)
{
    var Video_File_Path = '"' + process.execPath.split('nwjs.app')[0] + 'nodejs/IMG_6869.mov' +'"';
    var Video_Open_Script = 'open ' + Video_File_Path;
    var PPT_File_Path = '"' + process.execPath.split('nwjs.app')[0] + 'nodejs/test.pdf"';
    var PPT_Open_Script = 'open ' + PPT_File_Path;
    var WebSite = '"http://www.mywelle.com"';
    var Web_Open_Script = 'open location ' + WebSite;
    var applescript = require('applescript');
    var script;
    // console.log(process.execPath);
    // console.log(__dirname)
    // console.log(process.cwd())//good
    // console.log(process.execPath.split('nwjs.app')[0])
    switch(index_dollar_reco)
    {
        case 'I':
            script = 'tell application "System Events" \r key code 49 \r end tell';
            applescript.execString(script);
            break;
        case 'X':
            // script = 'tell application "System Events" \r set activeApp to name of first application process whose frontmost is true \r end tell \r tell application activeApp \r quit \r end tell';
            script = 'tell application "System Events" \r\n keystroke "x" \r\n end tell'
            applescript.execString(script,function(){
                
            });
            break;
        case 'H':
            // script = 'tell application "System Events" \r key down option \r keystroke space \r key up option \r end tell';
            // applescript.execString(script);
            break;
        case 'V':
            // script = 'tell application "QuickTime Player" \r\n ' + Video_Open_Script + ' \r\n end tell';
            // applescript.execString(script);
            // script = 'tell application "System Events" \r\n ' + 'tell process "QuickTime Player" \r\n ' + 'set frontmost to true \r\n end tell \r\n' + 'delay 1 \r\n' + 'keystroke "f" using {control down, command down} \r\n ' + 'delay 1 \r\n'
            //  + 'key code 49 \r\n' + ' end tell'
            script = 'tell application "System Events" \r\n keystroke "v" \r\n end tell'
            applescript.execString(script);
            break;
        case 'P':
            // script = 'tell application "Preview" \r\n ' +  PPT_Open_Script +  ' \r\n end tell'
            // applescript.execString(script);
            // script = 'tell application "System Events" \r\n ' + 'tell process "Preview" \r\n ' + 'set frontmost to true \r\n end tell \r\n' + 'delay 1 \r\n' + 'keystroke "g" using {option down, command down} \r\n '
            // + 'keystroke 1 \r\n' + 'keystroke return \r\n ' + 'keystroke "f" using {control down, command down} \r\n ' + 'end tell';
            script = 'tell application "System Events" \r\n keystroke "p" \r\n end tell'
            applescript.execString(script);
            break;
        case 'S':
            // script = 'tell application "Microsoft PowerPoint" \r set temp to slide show settings of active presentation \r set starting slide of temp to 1 \r set ending slide of temp to 5 \r run slide show temp \r end tell';
            // applescript.execString(script);
            break;
        case 'LR':
            script = 'tell application "System Events" \r\n key code 124 \r\n end tell'
            applescript.execString(script);
            break;
        case 'RL':
            script = 'tell application "System Events" \r\n key code 123 \r\n end tell'
            applescript.execString(script);
            break;
        case 'M':
            // script = 'tell application "Safari" \r\n ' + Web_Open_Script + ' \r\nend tell\r\n tell application "System Events" \r\n tell process "Safari" \r\n set frontmost to true \r\n end tell \r\n end tell';
            // applescript.execString(script);
            break;
        default:
            break;
    }
}

module.exports = GestureControlApps;