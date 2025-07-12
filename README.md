# MeshCentral User Manager Plugin

A MeshCentral plugin to simplify Windows user account management on remote devices.

## ✨ Features

- ✅ Create local Windows users remotely
- 👤 Select between **Administrator** or **Standard** accounts
- ❌ Remove existing **Standard** users
- 🔒 Prevent removal of Administrator accounts for safety
- 📝 Basic logging of actions taken through the plugin interface

## ✅ Install via URL
To install this plugin directly in MeshCentral:
- Open your MeshCentral web interface as admin.
- Go to the Plugins section.
- Click on Install Plugin from URL.
- Enter the following URL: `https://raw.githubusercontent.com/aalonzolu/meshcentral-user-manager/master/config.json`
- Click OK to install. MeshCentral will download and activate the plugin.

## 🛠 Usage

### Create a user
1. Enter the username and password.
2. Select the role (**Admin** or **Normal**).
3. Click **Create**.
4. A confirmation message will appear, and logs will show the operation result.

### Remove a user
1. Enter the username to remove.
2. Click **Delete**.
3. Only users with **Normal** privileges will be removed. Admins are protected.

## ⚠️ Warnings & Notes

- This plugin currently works only via the MeshCentral web interface.
- Users are created or deleted on a **per-device basis**.
- Administrator accounts cannot be removed for safety reasons.
- This plugin is intended for Windows devices only.
- Make sure MeshAgent is running with sufficient privileges to create/remove users.

## 🧩 Plugin Structure

- `plugin.info`: Metadata for MeshCentral.
- `plugin.js`: Backend logic for creating and deleting users.
- `web/index.html`: User interface embedded in the device view.

## 📄 License

MIT License

---

Created with ❤️ by [@aalonzolu](https://github.com/aalonzolu)
