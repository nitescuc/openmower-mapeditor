# openmower-mapeditor
Quick and dirty map editor for [Openmower](https://openmower.de/)

# What's working
- Open map files
- Show the map with Navigation Areas, Mowing Areas, Obstacles
- Drag and Drop to modify areas
- Delete points from areas
- Insert points (Shift+Click on a path)
- Backup the map file and save the changes to a new map.bag file

# TODO
- Clean the code
- Create a React component
- Use mower_map_service to manipulate the map
- rosjs ?
- Split areas
- Snap on grid
- Display coordinates

# Running

Execute the following command to run the map editor on the OpenMower system:

```
sudo podman run --replace --detach --tty \
  --name openmower-mapeditor \
  --volume /root/ros_home/.ros:/map \
  -p 5000:5000 \
  ghcr.io/nitescuc/openmower-mapeditor:main
```

After saving the map, `openmower` service will need to restarted to load the new map:

```
sudo systemctl restart openmower
```
