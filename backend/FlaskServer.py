from flask import Flask

#https://flask.palletsprojects.com/en/3.0.x/deploying/eventlet/
import eventlet

from eventlet import wsgi

from flask_socketio import SocketIO
import os

from sqlalchemy import and_
from sqlalchemy.orm import sessionmaker
from database import *

from SproutChatBot import get_response

app = Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins="*", ping_timeout=10, ping_interval=5)

sg_timezone = timezone(timedelta(hours=8))  # UTC +8

# create sqlite database
db_filepath = os.path.join(os.getcwd(), 'backend/community_garden.db')
engine = create_engine(f'sqlite:///{db_filepath}')
Base.metadata.create_all(engine)

# create a session
Session = sessionmaker(bind=engine)
    
@socketio.event
def connect():
    print("Client connected")

@socketio.event
def disconnect():
    print("Client disconnected")

@socketio.on('FoodWasteBin')
def FoodWasteBin(RxData):
    if isinstance(RxData, dict):
        try:
            device_id = RxData.get('device_id')
            garden_id = RxData.get('garden_id')
            bin_opened = RxData.get('bin_opened')
            bin_percentage_filled = RxData.get('bin_percentage_filled')
            weight = RxData.get('weight')
            timestamp = datetime.now(sg_timezone).isoformat() # get the current date and time in iso8601 format

            # create a session to interact with the database
            session = Session()

            # insert relevant data into database table
            insert_bin_data(session=session,
                            device_id=device_id,
                            garden_id=garden_id,
                            bin_opened=bin_opened,
                            bin_percentage_filled=bin_percentage_filled,
                            weight=weight,
                            timestamp=timestamp)

            session.close()

            print(f"Received Food Waste bin data: {RxData}")
        except Exception as e:
            print(f"Error handling Food Waste bin event: {e}")
    else:
        print("Invalid data format for Food Waste bin event")

@socketio.on('PestDetection')
def PestDetection(RxData):
    if isinstance(RxData, dict):
        try:
            device_id = RxData.get('device_id')
            garden_id = RxData.get('garden_id')
            pest_detected = RxData.get('pest_detected')
            buzzer_status = RxData.get('buzzer_status')
            timestamp = datetime.now(sg_timezone).isoformat() # get the current date and time in iso8601 format

            # create a session to interact with the database
            session = Session()

            # insert relevant data into database table
            insert_pest_detection_data(session=session,
                            device_id=device_id,
                            garden_id=garden_id,
                            pest_detected=pest_detected,
                            buzzer_status=buzzer_status,
                            timestamp=timestamp)

            session.close()

            print(f"Received Pest Detection data: {RxData}")
        except Exception as e:
            print(f"Error handling for Pest Detection event: {e}")
    else:
        print("Invalid data format for Pest Detection event")

@socketio.on('PlantPlot')
def PlantPlot(RxData):
    if isinstance(RxData, dict):
        try:
            device_id = RxData.get('device_id')
            plot_id = RxData.get('plot_id')
            garden_id = RxData.get('garden_id')
            moisture_value = RxData.get('moisture_value')
            plant_height = RxData.get('plant_height')
            light_value = RxData.get('light_value')
            temperature_value = RxData.get('temperature_value')
            timestamp = datetime.now(sg_timezone).isoformat() # get the current date and time in iso8601 format

            # create a session to interact with the database
            session = Session()

            # insert relevant data into database table
            insert_plant_plot_data(session=session,
                            device_id=device_id,
                            plot_id=plot_id,
                            garden_id=garden_id,
                            moisture_value=moisture_value,
                            plant_height=plant_height,
                            light_value=light_value,
                            temperature_value=temperature_value,
                            timestamp=timestamp)

            session.close()

            print(f"Received Plant Plot data: {RxData}")
        except Exception as e:
            print(f"Error handling Plant Plot event: {e}")
    else:
        print("Invalid data format for Plant Plot event")

@socketio.on('IrrigationTank', namespace="")
def IrrigationTank(RxData):
    if isinstance(RxData, dict):
        try:
            device_id = RxData.get('device_id')
            garden_id = RxData.get('garden_id')
            tank_percentage_filled = RxData.get('tank_percentage_filled')
            flame_detected = RxData.get('flame_detected')
            timestamp = datetime.now(sg_timezone).isoformat() # get the current date and time in iso8601 format

            # create a session to interact with the database
            session = Session()

            # insert relevant data into database table
            insert_irrigation_data(session=session,
                            device_id=device_id,
                            garden_id=garden_id,
                            tank_percentage_filled=tank_percentage_filled,
                            flame_detected=flame_detected,
                            timestamp=timestamp)

            print(f"Received Irrigation Tank data: {RxData}")

            water_level_list = session.query(PlantPlotData).where(PlantPlotData.moisture_value).all()
            
            if water_level_list[-1].moisture_value < 90:
                replenish_plant_water = True
            else:
                replenish_plant_water = False

            socketio.emit('replenishPlantWater', {'replenish_plant_water': replenish_plant_water })
            session.close()

            print(f"Sent plant data to Irrigation Tank: {replenish_plant_water}")
        except Exception as e:
            print(f"Error handling Irrigation Tank event: {e}")
    else:
        print("Invalid data format for Irrigation Tank event")

# Sign Up page

@socketio.on('accountCreated')
def accountCreated(accountDetails):
    if isinstance(accountDetails, dict):
        try:
            first_name = accountDetails.get('FirstName')
            last_name = accountDetails.get('LastName')
            gender = accountDetails.get('Gender')
            email = accountDetails.get('Email')
            password = accountDetails.get('Password')
            created_at = datetime.now(sg_timezone).isoformat()

            # create a session to interact with the database
            session = Session()

            # insert relevant data into database table
            insert_user_account_data(session=session,
                                     first_name=first_name,
                                     last_name=last_name,
                                     gender=gender,
                                     email=email,
                                     password=password,
                                     created_at=created_at)

            session.close()

            print(f"Received user account data: {accountDetails}")
        except Exception as e:
            print(f"Error handling user account data event: {e}")
    else:
        print("Invalid data format for user account data event")


# Login Page

@socketio.on('accountLoginAuth')
def accountLoginAuth(accountDetails):
    if isinstance(accountDetails, dict):
        try:
            entered_email = accountDetails.get('Email')
            entered_password = accountDetails.get('Password')

            session = Session()
            account = session.query(UserAccounts).where(and_(UserAccounts.email == entered_email, UserAccounts.password == entered_password)).first()

            if account != None:
                if account.password == entered_password:
                    socketio.emit('accountAuthResponse', {'success': True, 'user_id': account.user_id, 'message': f'Welcome back {account.first_name}!'})
                else:
                    socketio.emit('accountAuthResponse', {'success': False, 'message': 'Incorrect password'})
            else:
                socketio.emit('accountAuthResponse', {'success': False, 'message': 'User not found'})

            session.close()

            print(f"Received user account login data: {accountDetails}")
        except Exception as e:
            print(f"Error handling user account login data event: {e}")
    else:
        print("Invalid data format for user account login data event")


# Dashboard 
@socketio.on('fetchGraphData')
def fetchGraphData(garden_plot_details):
    def convert_plant_plot_data_to_dicts(plant_plot_data):
        return [plant.to_graph_data_dict() for plant in plant_plot_data]

    def convert_irrigation_tank_data_to_dicts(tank_data):
        return [tank.to_graph_data_dict() for tank in tank_data]

    def convert_pest_detection_data_to_dicts(pest_detection_data):
        return [pest.to_graph_data_dict() for pest in pest_detection_data]
    
    def convert_food_waste_bin_data_to_dicts(food_waste_bin_data):
        return [food_waste.to_graph_data_dict() for food_waste in food_waste_bin_data]

    if isinstance(garden_plot_details, dict):
        try:
            session = Session()

            user_garden = garden_plot_details.get('garden_id')
            user_plot = garden_plot_details.get('plot_id')

            plant_plot_data = session.query(PlantPlotData).where(and_(PlantPlotData.plot_id == user_plot, PlantPlotData.garden_id == user_garden)).all()
            
            irrigation_tank_data = session.query(IrrigationData).where(IrrigationData.garden_id == user_garden).all()

            pest_detection_data = session.query(PestDetectionData).where(PestDetectionData.garden_id == user_garden).all()

            food_waste_bin_data = session.query(FoodWasteBinData).where(FoodWasteBinData.garden_id == user_garden).all()

            socketio.emit('updateGraphData', {
                "plant_plot_data" : convert_plant_plot_data_to_dicts(plant_plot_data),
                "irrigation_tank_data" : convert_irrigation_tank_data_to_dicts(irrigation_tank_data),
                "pest_detection_data" : convert_pest_detection_data_to_dicts(pest_detection_data),
                "food_waste_bin_data" : convert_food_waste_bin_data_to_dicts(food_waste_bin_data)
            })
            session.close()

        except Exception as e:
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format for fetchGraphData event")

@socketio.on('userHasGarden')
def userHasGarden(userID):
    if isinstance(userID, dict):
        try:
            user_id = userID.get("user_id")
            session = Session()
            
            user_details = session.query(UserAccounts).where(UserAccounts.user_id == user_id).first()
            garden_id = user_details.garden_id

            if garden_id in ["NYP", "YCK"]:
                socketio.emit('userGardenStatus', { "user_has_garden": True })
            else:
                socketio.emit('userGardenStatus', { "user_has_garden": False })
            session.close()
        except Exception as e:
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format for userHasGarden event")

@socketio.on('requestPlotStatus')
def requestPlotStatus(PlotStatusRequestInfo):
    def convert_garden_data_to_dicts(garden_data):
        return [garden_plot.to_graph_data_dict() for garden_plot in garden_data]

    if isinstance(PlotStatusRequestInfo, dict):
        try:
            plot_selection = PlotStatusRequestInfo.get('plot_selection')
            
            if plot_selection == "All":
                session = Session()
            
                NYP_plot_status = session.query(NYPGarden).all()
                YCK_plot_status = session.query(YCKGarden).all()

                all_garden_plot_status = convert_garden_data_to_dicts(NYP_plot_status) + convert_garden_data_to_dicts(YCK_plot_status)

                socketio.emit('plotStatusResponse', {
                    "plot_status_list": all_garden_plot_status
                })
                
                session.close()
            else:
                print(f"Plot selection not specified as 'All', instead received: {PlotStatusRequestInfo.get('plot_selection')}")
        except Exception as e:
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format for requestPlotStatus event")

@socketio.on('PlotClaimed')
def PlotClaimed(PlotInfo):
    if isinstance(PlotInfo, dict):
        try:
            garden_id= PlotInfo.get('garden_id')
            plot_id = PlotInfo.get('plot_id')
            crop_type = PlotInfo.get('CropName')
            user_id = PlotInfo.get('user_id')

            session = Session()

            if garden_id == "NYP":
                table = NYPGarden
            elif garden_id == "YCK":
                table = YCKGarden
            else:
                print(f"invalid garden_id received: {garden_id}")

            plot = session.query(table).where(table.plot_id == plot_id).first()
            user_details = session.query(UserAccounts).where(UserAccounts.user_id == user_id).first()
            
            if user_details:
                user_details.garden_id = garden_id
                user_details.plot_id = plot_id
                session.commit()
            if plot:
                plot.occupancy = "Occupied"
                plot.crop_type = crop_type
                plot.plot_status = True
                plot.user_id = user_id            
                session.commit()
            session.close()
        except Exception as e:
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format for PlotClaimed event")


@socketio.on('fetchTasks')
def fetchTasks(fetchTasksRequest):
    def convert_task_board_data_to_dicts(task_board_data):
        return [task.to_graph_data_dict() for task in task_board_data]

    if isinstance(fetchTasksRequest, dict):
        try:
            user_id = fetchTasksRequest.get('user_id')
            session = Session()

            user_account = session.query(UserAccounts).where(UserAccounts.user_id == user_id).first()
            if user_account:
                user_garden_id = user_account.garden_id
                tasks = session.query(TaskBoard).where(TaskBoard.garden_id == user_garden_id).all()

            socketio.emit('TaskBoardTasks', {
                "task_board_tasks": convert_task_board_data_to_dicts(tasks),
                })
            session.close()
        except Exception as e:
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format format for fetchTasks event")

@socketio.on('fetchBBBWTasks')
def fetchBBBWTasks(fetchBBBWTasksRequest):
    def convert_task_board_data_to_dicts(task_board_data):
        return [task.to_graph_data_dict() for task in task_board_data]
    
    if isinstance(fetchBBBWTasksRequest, dict):
        try:
            garden_id = fetchBBBWTasksRequest.get('garden_id')
            session = Session()

            task_list = session.query(TaskBoard).where(TaskBoard.garden_id == 'NYP').all()
            
            socketio.emit('TaskBoardTasks', {
                "task_board_tasks": convert_task_board_data_to_dicts(task_list),
            })
            
            session.close()

            print(f'Received task board data: {fetchBBBWTasksRequest}')
        except Exception as e:
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format for fetchBBBWTasks event")

@socketio.on('updateTaskLabel')
def updateTaskLabel(TaskLabelData):
    if isinstance(TaskLabelData, dict):
        try:
            task_id = TaskLabelData.get('task_id')
            label = TaskLabelData.get('label')
            session = Session()

            task = session.query(TaskBoard).where(TaskBoard.id == task_id).first()
            if task:
                task.label = label
                session.commit()
                print(f'Task label updated for task {task_id}')
            else:
                print(f'Task not found: {task_id}')
            session.close()
        except Exception as e:
            session.rollback()
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format for updateTaskLabel event")

@socketio.on('taskCreated')
def taskCreated(data):
    def convert_task_board_data_to_dicts(task_board_data):
        return [task.to_graph_data_dict() for task in task_board_data]
        

    if isinstance(data, dict):
        try:
            title = data.get('Title')
            status = data.get('Status')
            label = data.get('Label')
            priority = data.get('Priority')
            user_id = data.get('user_id')

            session = Session()
            user = session.query(UserAccounts).where(UserAccounts.user_id == user_id).first()
            garden_id = user.garden_id


            device = session.query(Device).where(and_(Device.description == "Community Garden Task Board", Device.garden_id == garden_id)).first()
            device_id = device.device_id
            insert_task_board_data(session=session, device_id=device_id, title=title, status=status, label=label, priority=priority, garden_id=garden_id, timestamp=datetime.now(sg_timezone).isoformat())

            task_list = session.query(TaskBoard).where(TaskBoard.garden_id == user.garden_id).all()
            socketio.emit('TaskBoardTasks', {
                "task_board_tasks": convert_task_board_data_to_dicts(task_list),
            })

            session.close()
        except Exception as e:
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format for taskCreated event")

@socketio.event
def deleteTask(RxData):
    if isinstance(RxData, dict):
        try:
            task_id = RxData.get('task_id')
            session = Session()
            task = session.query(TaskBoard).where(TaskBoard.id == task_id).first()

            if task:
                session.delete(task)
                session.commit()
                print(f'Task deleted: {task_id}')
            else:
                print(f'Task not found: {task_id}')
            session.close()
        except Exception as e:
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format for deleteTask event")

@socketio.on('WebDeleteTasks')
def WebDeleteTasks(task_id):
    if isinstance(task_id, list):
        try:
            session = Session()
            for task_id in task_id:
                task = session.query(TaskBoard).where(TaskBoard.id == task_id).first()
                if task:
                    session.delete(task)
                    session.commit()
                    print(f'Task deleted: {task_id}')
                else:
                    print(f'Task not found: {task_id}')
            
            session.close()
        except Exception as e:
            session.rollback()
            print(f"Something went wrong! \n Error message: {e}")
    else:
        print("Invalid data format for WebDeleteTasks event")

@socketio.on('BBBWTaskBoard')
def BBBWTaskBoard(task_board_data):
    if isinstance(task_board_data, dict):
        try:
            task_id_to_remove = task_board_data.get('page_removed')

            session = Session()
            task_id_to_remove = int(task_id_to_remove[5:])

            delete_row(session=session, table_class=TaskBoard, column_name='id', value=task_id_to_remove)
        except Exception as e:
            print(f"Something went wrong while deleting task from the TaskBoard: {e}")
    else:
        print("Invalid data format for TaskBoard event")

    
# Chatbot
@socketio.on('ReqSproutResponse')
def SproutResponse(user_message):
    if isinstance(user_message, dict):
        try:
            message= user_message.get('message')

            SproutResponse = str(get_response(message))

            socketio.emit('SproutResponse', {
                "response": SproutResponse
            })

            print(f"{SproutResponse}")

        except Exception as e:
            print(f"Something went wrong while processing Sprout response: {e}")

    else:
        print("Invalid data format for SproutResponse event")

if __name__ == "__main__":
    wsgi.server(eventlet.listen(('192.168.0.172', 5000)), app)