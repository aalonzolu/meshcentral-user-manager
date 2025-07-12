/**
 * MeshCentral Local User Management Plugin (Agent Module)
 * Runs on the MeshAgent. Executes OS commands to create/delete a local Windows user.
 */
"use strict";
var mesh;         // Reference to MeshAgent core (set when consoleaction is called)
var _sessionid;   // Session ID for sending console output back to the requesting session

// The MeshAgent will call this function when a plugin message is received for "usermgmt"
function consoleaction(args, rights, sessionid, parent) {
    mesh = parent;
    _sessionid = sessionid;
    // Determine what action is requested (create or delete)
    var action = (args.pluginaction || args["_"][1]);
    try {
        switch (action) {
            case "createUser":
                createLocalUser(args.user, args.pass, args.admin);
                break;
            case "deleteUser":
                deleteLocalUser(args.user);
                break;
            default:
                // Unrecognized action
                sendConsoleMessage("UserMgmt: Unknown action \"" + action + "\"");
        }
    } catch (ex) {
        sendConsoleMessage("UserMgmt: Exception - " + ex.toString());
    }
}

// Create a local user account on Windows using 'net user'
function createLocalUser(username, password, addToAdmins) {
    if (!username || !password) {
        sendConsoleMessage("UserMgmt: Missing username or password.");
        return;
    }
    var cp = require('child_process');
    // Build the net user add command
    var cmd = 'net user "' + username + '" "' + password + '" /add';
    cp.exec(cmd, function(error, stdout, stderr) {
        if (error) {
            sendConsoleMessage("Error creating user \"" + username + "\": " + error.message);
        } else {
            sendConsoleMessage("User \"" + username + "\" has been created successfully.");
            // If the admin checkbox was selected, add the user to the Administrators group
            if (addToAdmins) {
                var cmd2 = 'net localgroup Administrators "' + username + '" /add';
                cp.exec(cmd2, function(error2, stdout2, stderr2) {
                    if (error2) {
                        sendConsoleMessage("Note: Could not add \"" + username + "\" to Administrators group. (" + error2.message + ")");
                    } else {
                        sendConsoleMessage("User \"" + username + "\" added to the Administrators group.");
                    }
                });
            }
        }
    });
}

// Delete a local user account on Windows using 'net user'
function deleteLocalUser(username) {
    if (!username) {
        sendConsoleMessage("UserMgmt: Missing username for deletion.");
        return;
    }
    var cp = require('child_process');
    var cmd = 'net user "' + username + '" /delete';
    cp.exec(cmd, function(error, stdout, stderr) {
        if (error) {
            sendConsoleMessage("Error deleting user \"" + username + "\": " + error.message);
        } else {
            sendConsoleMessage("User \"" + username + "\" has been deleted.");
        }
    });
}

// Helper: send a message back to the server to be shown in the console (Terminal tab)
function sendConsoleMessage(text) {
    if (!mesh || !text) return;
    try {
        mesh.SendCommand({ action: "msg", type: "console", value: text, sessionid: _sessionid });
    } catch (e) { }
}

// Export the consoleaction function so MeshAgent can invoke it for this plugin
module.exports = { consoleaction: consoleaction };
