import sys
from flask import Flask, request, render_template
import rosbag
from geometry_msgs.msg import Point32
import datetime
import json
import os

app = Flask(__name__)


@app.route("/", methods=["GET"])
def get_index():
    return render_template("index.html")

@app.route("/js/ros.js", methods=["GET"])
def get_js():
    return render_template("ros.js")


@app.route("/map", methods=["GET"])
def get_map():
    map_path = app.config["map_path"]
    # Deserialize map.bag using ROS bag deserializer
    bag = rosbag.Bag(map_path, "r")
    message = {}
    for topic, msg, t in bag.read_messages():
#        print(topic, msg)
        if "_mower_map__MapArea" in str(type(msg)):
            # Process messages as needed
            if topic not in message:
                message[topic] = []
            message[topic].append(
                {
                    "points": list(
                        map(lambda p: {"x": p.x, "y": p.y, "z": p.z}, msg.area.points)
                    ),
                    "obstacles": list(
                        map(
                            lambda o: {
                                "points": list(
                                    map(
                                        lambda p: {"x": p.x, "y": p.y, "z": p.z},
                                        o.points,
                                    )
                                )
                            },
                            msg.obstacles,
                        )
                    ),
                }
            )
        if topic == "docking_point":
            message["docking_point"] = {
                "position": {
                    "x": msg.position.x,
                    "y": msg.position.y,
                    "z": msg.position.z,
                },
                # "orientation": {
                #     "x": msg.orientation.x,
                #     "y": msg.orientation.y,
                #     "z": msg.orientation.z,
                #     "w": msg.orientation.w,
                # },
            }
    bag.close()

    return json.dumps(message)


def to_Point32_list(points):
    return list(map(lambda p: Point32(p["x"], p["y"], 0), points))


@app.route("/map", methods=["POST"])
def post_map():
    map_path = app.config["map_path"]
    out_path = os.path.join(os.path.dirname(map_path), "out.bag")
    # Rename map.bag to map.old
    json_data = request.get_json()

    nav_area_idx = 0
    mow_area_idx = 0
    org_map_bag = rosbag.Bag(map_path, "r")
    out_map_bag = rosbag.Bag(out_path, "w")
    for topic, msg, t in org_map_bag.read_messages():
        if "_mower_map__MapArea" in str(type(msg)):
            if topic == "mowing_areas":
                data = json_data[topic][mow_area_idx]
                mow_area_idx += 1
            elif topic == "navigation_areas":
                data = json_data[topic][nav_area_idx]
                nav_area_idx += 1
            msg.area.points = to_Point32_list(data["points"])
            for o_idx in range(len(msg.obstacles)):
                msg.obstacles[o_idx].points = to_Point32_list(
                    data["obstacles"][o_idx]["points"]
                )
        if topic == "docking_point":
            data = json_data[topic]
            msg.position.x = data["position"]["x"]
            msg.position.y = data["position"]["y"]
            msg.position.z = data["position"]["z"]
            # msg.orientation.x = data["orientation"]["x"]
            # msg.orientation.y = data["orientation"]["y"]
            # msg.orientation.z = data["orientation"]["z"]
            # msg.orientation.w = data["orientation"]["w"]

        out_map_bag.write(topic, msg, t)
    out_map_bag.close()

    if os.path.exists(map_path):
        os.rename(
            map_path,
            os.path.join(
                os.path.dirname(map_path),
                datetime.datetime.now().strftime("map_%Y%m%d_%H%M%S.bak"),
            ),
        )
    os.rename(out_path, map_path)

    return "Map data saved successfully"


if __name__ == "__main__":
    app.config["map_path"] = sys.argv[1] if len(sys.argv) > 1 else "map.bag"
    app.run(host="0.0.0.0", port=5000)
