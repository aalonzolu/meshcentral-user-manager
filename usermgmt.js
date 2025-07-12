/** 
 * MeshCentral Local User Management Plugin (Web UI Module)
 * Allows creating/removing a local Windows user on the selected device.
 */
"use strict";

module.exports.usermgmt = function(parent) {
    var obj = {};
    obj.parent = parent;  // Reference to parent objects (MeshCentral structures)

    // Hook: When a device page is loaded or refreshed, add our tab and content.
    obj.onDeviceRefreshEnd = function() {
        // Register a new device tab for "User Management" if not already present
        parent.parent.plugins.registerPluginTab({
            tabId: "usermgmt",
            tabTitle: "User Management"
        });
        // Build the HTML content for our tab
        var html = "";
        html += "<div style='padding:10px; font-family:Arial,sans-serif;'>";
        html += "<h3>Create Local User</h3>";
        html += "<label>Username: <input type='text' id='um_username'/></label><br/>";
        html += "<label>Password: <input type='password' id='um_password'/></label><br/>";
        html += "<label><input type='checkbox' id='um_admin'/> Add to Administrators group</label><br/>";
        html += "<button id='um_createBtn'>Create User</button>";
        html += "<hr style='margin:15px 0;'/>";
        html += "<h3>Delete Local User</h3>";
        html += "<label>Username: <input type='text' id='um_deluser'/></label><br/>";
        html += "<button id='um_deleteBtn' style='margin-top:5px;'>Delete User</button>";
        html += "<p id='um_status' style='color:green; margin-top:10px;'></p>";  // Status message area
        html += "</div>";
        // Insert the HTML into our tab's container div
        var container = document.getElementById("usermgmt");
        if (container) {
            container.innerHTML = html;
            // Attach event listeners for the buttons
            document.getElementById("um_createBtn").onclick = function() {
                var uname = document.getElementById("um_username").value.trim();
                var pwd   = document.getElementById("um_password").value;
                var makeAdmin = document.getElementById("um_admin").checked;
                if (!uname || !pwd) {
                    alert("Please specify a username and password.");
                    return;
                }
                // Send plugin command to agent to create user
                var cmd = {
                    action: "plugin",
                    plugin: "usermgmt",
                    pluginaction: "createUser",
                    user: uname,
                    pass: pwd,
                    admin: makeAdmin
                };
                parent.parent.SendCommand(currentNodeId(), cmd);
                // Log attempt in device event log (pre-fill an event note)
                openAuditLogEntry("Local user \"" + uname + "\" creation command issued.");
                // Update UI status
                document.getElementById("um_status").innerText = "User creation command sent to device.";
            };
            document.getElementById("um_deleteBtn").onclick = function() {
                var uname = document.getElementById("um_deluser").value.trim();
                if (!uname) {
                    alert("Please specify a username to delete.");
                    return;
                }
                // Send plugin command to agent to delete user
                var cmd = {
                    action: "plugin",
                    plugin: "usermgmt",
                    pluginaction: "deleteUser",
                    user: uname
                };
                parent.parent.SendCommand(currentNodeId(), cmd);
                // Log attempt in device event log
                openAuditLogEntry("Local user \"" + uname + "\" deletion command issued.");
                // Update status message
                document.getElementById("um_status").innerText = "User deletion command sent to device.";
            };
        }
    };

    // Utility: get current node ID (MeshCentral stores selected node in currentNode)
    function currentNodeId() {
        return (typeof currentNode !== 'undefined') ? currentNode._id : null;
    }

    // Utility: open and pre-fill the device event log entry box for auditing:contentReference[oaicite:6]{index=6}
    function openAuditLogEntry(message) {
        if (!currentNodeId()) return;
        // Trigger the device event dialog
        if (typeof writeDeviceEvent === "function") {
            writeDeviceEvent(encodeURIComponent(currentNodeId()));
            // Pre-fill with timestamp and our message
            var logInput = document.getElementById("d2devEvent");
            if (logInput) {
                logInput.value = new Date().toLocaleString() + ": " + message;
                focusTextBox("d2devEvent");  // highlight it for the user
            }
        }
    }

    return obj;
};
