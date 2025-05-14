function contextMenu(menu) {

	// create the div element that will hold the context menu
	d3.selectAll('.d3-context-menu').data([1])
		.enter()
		.append('div')
		.attr('class', 'd3-context-menu');

	// close menu
	d3.select('body').on('click.d3-context-menu', function() {
		d3.select('.d3-context-menu').style('display', 'none');
	});

	// this gets executed when a contextmenu event occurs
	return function(event, data, index) {	
		var elm = this;

		d3.selectAll('.d3-context-menu').html('');
		var list = d3.selectAll('.d3-context-menu').append('ul');
		list.selectAll('li').data(menu).enter()
			.append('li')
			.html(function(d) {
				return d.title;
			})
			.on('click', function(event, d, i) {
				d.action(elm, data, event);
				d3.select('.d3-context-menu').style('display', 'none');
			});

		// display context menu
		d3.select('.d3-context-menu')
			.style('left', (event.pageX - 2) + 'px')
			.style('top', (event.pageY - 2) + 'px')
			.style('display', 'block');

		event.preventDefault();
	};
};

function getMenuVertex(context) {
    const map = context.map;
    return [{
      title: 'Set as first point',
      action: function(elm, d, event) {
        elm = d3.select(elm);
        const areaIndex = elm.attr("data-area-index");
        const areaType = elm.attr("area-type");
        const pointIndex = elm.attr("data-point-index");
        let parentObject;
        switch(areaType) {
            case "navigation-group":
                parentObject = map.navigation_areas[areaIndex];
                break;
            case "mowing-group":
                parentObject = map.mowing_areas[areaIndex];
                break;
            case "obstacle":
                parentObject = map.mowing_areas[areaIndex].obstacles[obstacleIndex];
                break;
        }
        const points = parentObject.points;
        parentObject.points = points.slice(pointIndex).concat(points.slice(0, pointIndex));
        renderNavigationArea((areaType === "obstacle" ? map.mowing_areas[areaIndex] : parentObject), areaIndex, areaType, true);
      }
    }]
}

function _makeAreaPoints(event, context) {
	const pointer = d3.pointer(event, d3.select("#" + context.className + "-" + context.areaIndex).node());
	const menuPointer = d3.pointer(event, d3.select(".d3-context-menu").node());		
	const x = xScale.invert(pointer[0] - menuPointer[0]);
	const y = yScale.invert(pointer[1] - menuPointer[1]);
	const points = [];
	for (let i = 0; i < 8; i++) {
		points.push({x: x + 0.5 * Math.cos(i * Math.PI / 4), y: y + 0.5 * Math.sin(i * Math.PI / 4)});
	}
	return points;
}

function getMenuArea(context) {
	const map = context.map;
	const area = context.area;
	return [{
		title: 'Add obstacle',
		action: function(elm, d, event) {
			area.obstacles.push({points: _makeAreaPoints(event, context), _deleted: false});
			renderNavigationArea(area, context.areaIndex, context.className, true);
		}, 
	}, {
		title: 'Add area before',
		action: function(elm, d, event) {
			points = _makeAreaPoints(event, context);
			const newArea = {
				points: points,
				obstacles: [],
				_deleted: false
			};
			map.mowing_areas.splice(context.areaIndex, 0, newArea);
			renderAreas(map.mowing_areas,  "mowing-group");
		}, 
	}, {
		title: 'Add area after',
		action: function(elm, d, event) {
			points = _makeAreaPoints(event, context);
			const newArea = {
				points: points,
				obstacles: [],
				_deleted: false
			};
			map.mowing_areas.splice(context.areaIndex+1, 0, newArea);
			renderAreas(map.mowing_areas,  "mowing-group");
		}, 
	}, {
		title: (area._deleted ? 'Restore': 'Delete'),
		action: function(elm, d, event) {
			area._deleted = (area._deleted ? false : true);
			renderNavigationArea(area, context.areaIndex, context.className, true);
		}
	}, {
		title: 'Slice',
		action: function(elm, d, event) {
			context.group.selectAll(".mow-path").remove();
			getMowPath(area.points, area.obstacles, {}, function(result) {
			  for (let path of result.paths) {
				context.group.append("polyline")
				  .attr("class", "mow-path mow-path-"+(path.is_outline ? "outline" : "inner"))
				  .attr("points", path.path.poses.map(p => `${xScale(p.pose.position.x)}, ${yScale(p.pose.position.y)}`).join(" "));
			  }
			});
		}
	}, {
		title: 'Start here',
		action: function(elm, d, event) {
			context.group.selectAll(".mow-path").remove();
			startArea(context.areaIndex);
		}
	}]
}

function getMenuObstacle(context) {
	const area = context.area;
	const obstacle = context.obstacle;
	return [{
		title: (obstacle._deleted ? 'Restore': 'Delete'),
		action: function(elm, d, event) {
			obstacle._deleted = (obstacle._deleted ? false : true);
			renderNavigationArea(area, context.areaIndex, context.className, true);
		}
	}]
}