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
				d.action(elm, data, index);
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
      action: function(elm, d, i) {
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
