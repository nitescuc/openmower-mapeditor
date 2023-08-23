var ros = new ROSLIB.Ros();
  // If there is an error on the backend, an 'error' emit will be emitted.
  ros.on('error', function(error) {
    console.log(error);
  });

  // Find out exactly when we made a connection.
  ros.on('connection', function() {
    console.log('Connection made!');
  });

  ros.on('close', function() {
    console.log('Connection closed.');
  });

function getMowPath(area, obstacles, config, cb) {
    if (!ros.isConnected) {
        return;
    }
    let angle = config.angle;
    if (angle == null) {
      angle = Math.atan2((area[1].y - area[0].y), (area[1].x - area[0].x));
    }
    var slicerService = new ROSLIB.Service({
        ros: ros,
        name: 'slic3r_coverage_planner/plan_path',
        serviceType: 'slic3r_coverage_planner/PlanPath'
    });
    var request = new ROSLIB.ServiceRequest({
        angle,
        outline_count: 4,
        outline: {points: area},
        holes: obstacles,
        fill_type: 0,
        outer_offset: 0.2,
        distance: 0.13
    });
    if (slicerService) {
        slicerService.callService(request, cb, console.error);
    }
}

function startPositionListener(cb) {
    var listener = new ROSLIB.Topic({
        ros: ros,
        name: 'xbot_positioning/xb_pose',
        messageType: 'xbot_msgs/AbsolutPose'
    });
    listener.subscribe(cb);
}