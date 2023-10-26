let currentState = "IDLE";
let positionListener = null;
let gpsListener = null;
let bumperListeners = [];
let lastPosition = null;

var ros = new ROSLIB.Ros();
  // If there is an error on the backend, an 'error' emit will be emitted.
  ros.on('error', function(error) {
    console.log(error);
  });

  // Find out exactly when we made a connection.
  ros.on('connection', function() {
    console.log('Connection made!');

    // start position listener
    startPositionListener(position => {
      lastPosition = position.pose.pose.position;
      addRobotPosition(position.pose.pose.position);
    });
    startStateListener(state => {
      if (currentState !== state.state_name) {
        currentState = state.state_name;
        if (currentState === "MOWING") {
          // start gps listener
          startGpsListener(position => {
            addGpsPosition(position);
          });
          // start bumper listener
          startBumpersListener(() => {
            addHitPosition(lastPosition);
          })
        } else {
          stopGpsListener();
          stopBumpersListener();
        }
      }
    });
  });

  ros.on('close', function() {
    console.log('Connection closed.');
    if (positionListener) {
      positionListener.unsubscribe();
      positionListener = null;
    }
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
        outer_offset: 0.3,
        distance: 0.13
    });
    if (slicerService) {
        slicerService.callService(request, cb, console.error);
    }
}

function startArea(areaIndex) {
  if (!ros.isConnected) {
      return;
  }
  var startService = new ROSLIB.Service({
    ros: ros,
    name: 'mower_service/start_in_area',
    serviceType: 'mower_msgs/StartInAreaSrv'
  });
  var request = new ROSLIB.ServiceRequest({
      area: areaIndex
  });
  if (startService) {
      startService.callService(request, console.log, console.error);
  }      
}

function start() {
  if (!ros.isConnected) {
      return;
  }
  var startService = new ROSLIB.Service({
    ros: ros,
    name: 'mower_service/high_level_control',
    serviceType: 'mower_msgs/HighLevelControlSrv'
  });
  var request = new ROSLIB.ServiceRequest({
      command: 1
  });
  if (startService) {
      startService.callService(request, console.log, console.error);
  }      
}

function dock() {
  if (!ros.isConnected) {
    return;
  }
  var startService = new ROSLIB.Service({
    ros: ros,
    name: 'mower_service/high_level_control',
    serviceType: 'mower_msgs/HighLevelControlSrv'
  });
  var request = new ROSLIB.ServiceRequest({
      command: 2
  });
  if (startService) {
      startService.callService(request, console.log, console.error);
  }      
}

function skip() {
  if (!ros.isConnected) {
    return;
  }
  var startService = new ROSLIB.Service({
    ros: ros,
    name: 'mower_service/high_level_control',
    serviceType: 'mower_msgs/HighLevelControlSrv'
  });
  var request = new ROSLIB.ServiceRequest({
      command: 4
  });
  if (startService) {
      startService.callService(request, console.log, console.error);
  }      
}


function startPositionListener(cb) {
  positionListener = new ROSLIB.Topic({
      ros: ros,
      name: 'xbot_positioning/xb_pose',
      messageType: 'xbot_msgs/AbsolutePose',
      throttle_rate: 1000
  });
  positionListener.subscribe(cb);
}

function startGpsListener(cb) {
  gpsListener = new ROSLIB.Topic({
      ros: ros,
      name: '/xbot_driver_gps/xb_pose',
      messageType: 'xbot_msgs/AbsolutePose',
      throttle_rate: 1000
  });
  gpsListener.subscribe(cb);
}

stopGpsListener = () => {
  if (gpsListener) {
    gpsListener.unsubscribe();
    gpsListener = null;
  }
}

function startBumpersListener(cb) {
  if (bumperListeners.length > 0) {
    stopBumpersListener();
  }
  bumperListeners[0] = new ROSLIB.Topic({
    ros: ros,
    name: 'bumper/left',
    messageType: 'sensor_msgs/Range',
    throttle_rate: 100
  });
  bumperListeners[0].subscribe(range => {
    if (range.range > 0) {
      cb();
    }
  });
  bumperListeners[1] = new ROSLIB.Topic({
    ros: ros,
    name: 'bumper/right',
    messageType: 'sensor_msgs/Range',
    throttle_rate: 100
  });
  bumperListeners[1].subscribe(range => {
    if (range.range > 0) {
      cb();
    }
  });
}

function stopBumpersListener() {
  bumperListeners.forEach(listener => {
    listener.unsubscribe();
  });
  bumperListeners = [];
}

function startStateListener(cb) {
  var listener = new ROSLIB.Topic({
      ros: ros,
      name: '/mower_logic/current_state',
      messageType: 'mower_msgs/HighLevelStatus',
      throttle_rate: 1000
  });
  listener.subscribe(cb);
}

function addGpsPosition(position, onlyFloat = true) {
  let positionGroups = mainGroup.selectAll(".position-group");
  if (positionGroups.empty()) {
    positionGroups = mainGroup.selectAll(".position-group")
      .data([{start:{x: position.x, y: position.y}}])
      .enter()
      .append("g")
      .attr("class", "position-group");
  }
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", 2);
  circle.setAttribute("cx", xScale(position.pose.pose.position.x));
  circle.setAttribute("cy", yScale(position.pose.pose.position.y));
  if (position.flags === 3) {
    circle.setAttribute("class", "gps-position-fixed");
    if (!onlyFloat)
      positionGroups.node().appendChild(circle);
  } else {
    circle.setAttribute("class", "gps-position-float");
    positionGroups.node().appendChild(circle);
  }
}

function addRobotPosition(position) {
  if (currentState === "MOWING") {
    // make sure we created after area polygons
    const areaGroups = mainGroup.selectAll(".mowing-group");
    if (areaGroups.empty()) return;
    let positionGroups = mainGroup.selectAll(".position-group");
    if (positionGroups.empty()) {
      positionGroups = mainGroup.selectAll(".position-group")
        .data([{start:{x: position.x, y: position.y}}])
        .enter()
        .append("g")
        .attr("class", "position-group");
      positionGroups.append("polyline")
        .attr("id", "robot-position")
        .attr("class", d => "robot-position")
        .attr("points", d => `${xScale(d.start.x)}, ${yScale(d.start.y)}`);
    }

    let point = mainGroup.node().createSVGPoint();
    point.x = xScale(position.x);
    point.y = yScale(position.y);
    let polyline = document.getElementById('robot-position');
    polyline.points.appendItem(point);
  }
  robotPositionSymbolGroup = mainGroup.selectAll("#robot-current-position");
  if (robotPositionSymbolGroup.empty()) {
    robotPositionSymbolGroup = mainGroup.selectAll("#robot-current-position")
      .data([{start:{x: position.x, y: position.y}}])
      .enter()
      .append("g")
      .attr("id", "robot-current-position");
  }
  robotPositionSymbolGroup.attr("transform", d => `translate(${xScale(d.start.x)-8}, ${yScale(d.start.y)-8})`);
  sheep(robotPositionSymbolGroup);
}

function addHitPosition(point) {
  let positionGroups = mainGroup.selectAll(".hit-group");
  if (positionGroups.empty()) {
    positionGroups = mainGroup.selectAll(".hit-group")
      .data([{start:{x: point.x, y: point.y}}])
      .enter()
      .append("g")
      .attr("class", "hit-group");
  }
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", 5);
  circle.setAttribute("cx", xScale(point.x));
  circle.setAttribute("cy", yScale(point.y));
  circle.setAttribute("class", "hit-position");
  positionGroups.node().appendChild(circle);
}
