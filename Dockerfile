FROM ros:noetic-ros-base-focal

RUN apt update && apt install -y python3-pip

WORKDIR /usr/src/app
ADD app/requirements.txt /usr/src/app

RUN pip3 install -r requirements.txt

ADD app /usr/src/app

EXPOSE 5000

CMD ["python3", "app.py", "--map=/map/map.bag"]
