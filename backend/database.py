from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
from datetime import datetime, timezone, timedelta
from sqlalchemy.exc import IntegrityError
import os, uuid, random

Base = declarative_base()

# Define Singapore timezone
sg_timezone = timezone(timedelta(hours=8))  # UTC +8

class Device(Base):
    __tablename__ = 'devices'

    device_id = Column(String, name='device_id', primary_key=True, nullable=False)
    plot_id = Column(Integer, name='plot_id', nullable=True)
    garden_id = Column(String, name='garden_id', nullable=False)
    description = Column(String, name='description', nullable=True)

class FoodWasteBinData(Base):
    __tablename__ = 'food_waste_bin_data'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    device_id = Column(String, ForeignKey('devices.device_id'), nullable=False, name='device_id')
    garden_id = Column(String, ForeignKey('devices.garden_id'), nullable=False, name='garden_id')
    bin_opened = Column(Boolean, name='bin_opened')
    bin_percentage_filled = Column(Float, name='bin_percentage_filled')
    weight = Column(Float, name='weight')
    timestamp = Column(String, default=datetime.now(sg_timezone).isoformat(), name='timestamp')
    
    device = relationship('Device', foreign_keys=[device_id])
    garden = relationship('Device', foreign_keys=[garden_id])

    def to_graph_data_dict(self):  

        return {
            'timestamp': self.timestamp,
            'bin_percentage_filled': self.bin_percentage_filled,
            'weight': self.weight,
            'bin_opened': self.bin_opened
        }

class PlantPlotData(Base):
    __tablename__ = 'plant_plot_data'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    device_id = Column(String, ForeignKey('devices.device_id'), nullable=False, name='device_id')
    plot_id = Column(Integer, name='plot_id', nullable=False)
    garden_id = Column(String, ForeignKey('devices.garden_id'), nullable=False, name='garden_id')
    moisture_value = Column(Float, name='moisture_value')
    plant_height = Column(Float, name='plant_height')
    light_value = Column(Float, name='light_value')
    temperature_value = Column(Float, name='temperature_value')
    timestamp = Column(String, default=datetime.now(sg_timezone).isoformat(),  name='timestamp')

    device = relationship('Device', foreign_keys=[device_id])
    garden = relationship('Device', foreign_keys=[garden_id])

    def to_graph_data_dict(self):
        return {
            'timestamp': self.timestamp,
            'moisture_value': self.moisture_value,
            'temperature_value': self.temperature_value,
            'light_value': self.light_value,
            'plant_height': self.plant_height,
        }

class IrrigationData(Base):
    __tablename__ = 'irrigation_data'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    device_id = Column(String, ForeignKey('devices.device_id'), nullable=False, name='device_id')
    garden_id = Column(String, ForeignKey('devices.garden_id'), nullable=False, name='garden_id')
    tank_percentage_filled = Column(Float, nullable=False,  name='tank_percentage_filled')
    flame_detected = Column(Boolean, nullable=False,  name='flame_detected')
    timestamp = Column(String, default=datetime.now(sg_timezone).isoformat(), name='timestamp')
    
    device = relationship('Device', foreign_keys=[device_id])
    garden = relationship('Device', foreign_keys=[garden_id])

    def to_graph_data_dict(self):
        return {
            'timestamp': self.timestamp,
            'tank_percentage_filled': self.tank_percentage_filled,
            'flame_detected': self.flame_detected
        }

class TaskBoard(Base):
    __tablename__ = 'task_board'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    device_id = Column(String, ForeignKey('devices.device_id'), nullable=False, name='device_id')
    garden_id = Column(String, ForeignKey('devices.garden_id'), nullable=False, name='garden_id')
    title = Column(String, nullable=False, name='title')
    status = Column(String, nullable=False, name='status')
    label = Column(String, nullable=False, name='label')
    priority = Column(String, nullable=False, name='priority')
    timestamp = Column(String, default=datetime.now(sg_timezone).isoformat(), name='timestamp')

    device = relationship('Device', foreign_keys=[device_id])
    garden = relationship('Device', foreign_keys=[garden_id])

    def to_graph_data_dict(self):  
        task_id = f"TASK-{(4 - len(str(self.id))) * "0"}{self.id}"

        return {
        'timestamp': self.timestamp,
        'id': task_id,
        'title': self.title,
        'status': self.status,
        'label': self.label,
        'priority': self.priority,
        'garden_id': self.garden_id,
        }

class PestDetectionData(Base):
    __tablename__ = 'pest_detection_data'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    device_id = Column(String, ForeignKey('devices.device_id'), nullable=False, name='device_id')
    garden_id = Column(String, ForeignKey('devices.garden_id'), nullable=False, name='garden_id')
    pest_detected = Column(Boolean, name='pest_detected', nullable=False)
    buzzer_status = Column(String, name='buzzer_status', nullable=False)
    timestamp = Column(String, default=datetime.now(sg_timezone).isoformat(), name='timestamp')
    
    device = relationship('Device', foreign_keys=[device_id])
    garden = relationship('Device', foreign_keys=[garden_id])

    def to_graph_data_dict(self):  

        return {
        'pest_detected': self.pest_detected,
        'buzzer_status': self.buzzer_status
        }

class UserAccounts(Base):
    __tablename__ = 'user_accounts'

    user_id = Column(String, name="user_id", default=f"{uuid.uuid4()}", primary_key=True, nullable=False)
    first_name = Column(String, nullable=False, name="first_name")
    last_name = Column(String, nullable=False, name="last_name")
    gender = Column(String, nullable=False, name="gender")
    email = Column(String, unique=True, nullable=False, name="email")
    password = Column(String, nullable=False, name="password")
    plot_id = Column(String, nullable=True, name="plot_id")
    garden_id = Column(String, nullable=True, name="garden_id")
    is_admin = Column(Boolean, default=False, name='is_admin')
    created_at = Column(String, default=datetime.now(sg_timezone).isoformat(), name='created_at')

    def to_graph_data_dict(self):  

        return {
            'user_id': int(self.plot_id),
            'garden_id': "NYP",
        }

class NYPGarden(Base):
    __tablename__ = 'nyp_garden'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    plot_id = Column(String, nullable=False, name="plot_id")
    user_id = Column(String, nullable=True, name='user_id')
    occupancy = Column(String, nullable=False, name='occupancy')
    crop_type = Column(String, nullable=False, name='crop_type')
    plot_status = Column(Boolean, nullable=False, name='plot_status')

    def to_graph_data_dict(self):  
        button_text = "CLAIM" if self.occupancy == "Vacant" else "VIEW"

        if self.occupancy == "Vacant":
            status = "Not In Use"
        elif self.occupancy == "Occupied" and self.plot_status == 0:
            status = "Offline"
        elif self.occupancy == "Occupied" and self.plot_status == 1:
            status = "Online"

        return {
            'plot_id': int(self.plot_id),
            'garden_id': "NYP",
            'status': status,
            'crop_name': self.crop_type,
            'user_id': self.user_id,
            'button_text': button_text,
        }

class YCKGarden(Base):
    __tablename__ = 'yck_garden'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    plot_id = Column(String, nullable=False, name="plot_id")
    user_id = Column(String, nullable=True, name='user_id')
    occupancy = Column(String, nullable=False, name='occupancy')
    crop_type = Column(String, nullable=False, name='crop_type')
    plot_status = Column(Boolean, nullable=False, name='plot_status')

    def to_graph_data_dict(self):  
        button_text = "CLAIM" if self.occupancy == "Vacant" else "VIEW"

        if self.occupancy == "Vacant":
            status = "Not In Use"
        elif self.occupancy == "Occupied" and self.plot_status == 0:
            status = "Offline"
        elif self.occupancy == "Occupied" and self.plot_status == 1:
            status = "Online"

        return {
            'plot_id': int(self.plot_id),
            'garden_id': "YCK",
            'status': status,
            'crop_name': self.crop_type,
            'user_id': self.user_id,
            'button_text': button_text,
        }

# Create an SQLite database
# Assuming the database file is named 'community_garden.db' and located in the same directory as this script
db_filepath = os.path.join(os.getcwd(), 'backend/community_garden.db')
engine = create_engine(f'sqlite:///{db_filepath}')
Base.metadata.create_all(engine)

# Create a session
Session = sessionmaker(bind=engine)
# commit changes to the database schema
Session().commit()

# delete all rows in the databse

def delete_all_rows(table_class):
    session = Session()
    session.query(table_class).delete()
    session.commit()
    print(f"Deleted all rows from {table_class.__tablename__}")

def add_plots(session, garden_table, number_of_plots):
    for i in range(1, number_of_plots + 1):
        new_plot = garden_table(plot_id=str(i), user_id="", occupancy="Vacant", crop_type="not set", plot_status=False)
        session.add(new_plot)
    session.commit()
    print(f"Inserted {number_of_plots} plots")

def add_device(session,
               device_id : String,
               plot_id : Integer,
               garden_id : String,
               description : String):
    device = Device(device_id=device_id, plot_id=plot_id, garden_id=garden_id, description=description)
    session.add(device)
    session.commit()
    print(f"Inserted {device}")

def insert_bin_data(session,
                    device_id : String,
                    garden_id : String,
                    bin_opened : Boolean,
                    bin_percentage_filled : Float,
                    weight : Float,
                    timestamp : String):
    bin_data = FoodWasteBinData(device_id=device_id,
                                garden_id=garden_id,
                                bin_opened=bin_opened,
                                bin_percentage_filled=bin_percentage_filled,
                                weight=weight,
                                timestamp=timestamp)
    session.add(bin_data)

    try:
        session.commit()
        print(f"Inserted bin data for device_id {device_id}")
    except IntegrityError as e:
        session.rollback()
        raise ValueError(f"Integrity error: {str(e)}")
    except Exception as e:
        session.rollback()
        raise ValueError(f"Error adding bin data: {str(e)}")

def insert_plant_plot_data(session,
                           device_id : String,
                           plot_id : Integer,
                           garden_id : String,
                           moisture_value : String,
                           plant_height : Float,
                           light_value : Float,
                           temperature_value : Float,
                           timestamp : String):
    plant_plot_data = PlantPlotData(device_id=device_id,
                                    plot_id=plot_id,
                                    garden_id=garden_id,
                                    moisture_value=moisture_value, 
                                    plant_height=plant_height,
                                    light_value=light_value,
                                    temperature_value=temperature_value,
                                    timestamp=timestamp)
    session.add(plant_plot_data)

    try:
        session.commit()
        print(f"Inserted plant plot data for device_id {device_id}")
    except IntegrityError as e:
        session.rollback()
        raise ValueError(f"Integrity error: {str(e)}")
    except Exception as e:
        session.rollback()
        raise ValueError(f"Error adding plant plot data: {str(e)}")

def insert_irrigation_data(session, device_id : String,
                           garden_id : String,
                           tank_percentage_filled : Float,
                           flame_detected: Boolean,
                           timestamp : String):
    irrigation_data = IrrigationData(device_id=device_id,
                                     garden_id=garden_id,
                                     tank_percentage_filled=tank_percentage_filled,
                                     flame_detected=flame_detected,
                                     timestamp=timestamp)
    session.add(irrigation_data)

    try:
        session.commit()
        print(f"Inserted irrigation data for device_id {device_id}")
    except IntegrityError as e:
        session.rollback()
        raise ValueError(f"Integrity error: {str(e)}")
    except Exception as e:
        session.rollback()
        raise ValueError(f"Error adding irrigation data: {str(e)}")

def insert_task_board_data(session,
                           device_id : String,
                           garden_id : String,
                           title : String,
                           status : String,
                           label : String,
                           priority: String,
                           timestamp : String):
    task_board_data = TaskBoard(device_id=device_id,
                                garden_id=garden_id,
                                title=title,
                                status=status,
                                label=label,
                                priority=priority,
                                timestamp=timestamp)
    session.add(task_board_data)

    try:
        session.commit()
        print(f"Inserted task data from {garden_id}")
    except IntegrityError as e:
        session.rollback()
        raise ValueError(f"Integrity error: {str(e)}")
    except Exception as e:
        session.rollback()
        raise ValueError(f"Error adding task data: {str(e)}")

def insert_pest_detection_data(session,
                               device_id : String,
                               garden_id : String,
                               pest_detected : Boolean,
                               buzzer_status : Boolean,
                               timestamp : String):
    
    pest_detection_data = PestDetectionData(device_id=device_id,
                                            garden_id=garden_id,
                                            pest_detected=pest_detected,
                                            buzzer_status=buzzer_status,
                                            timestamp=timestamp)
    session.add(pest_detection_data)

    try:
        session.commit()
        print(f"Inserted pest detection data for device_id {device_id}")
    except IntegrityError as e:
        session.rollback()
        raise ValueError(f"Integrity error: {str(e)}")
    except Exception as e:
        session.rollback()
        raise ValueError(f"Error adding pest detection data: {str(e)}")

def insert_user_account_data(session,
                             first_name : String,
                             last_name : String,
                             gender : String,
                             email : String,
                             password : String,
                             created_at : String):
    user_account_data = UserAccounts(first_name=first_name,
                                     last_name=last_name,
                                     gender=gender,
                                     email=email,
                                     password=password,
                                     created_at=created_at)
    session.add(user_account_data)

    try:
        session.commit()
        print(f"Inserted user account data for {first_name}")
    except IntegrityError as e:
        session.rollback()
        raise ValueError(f"Integrity error: {str(e)}")
    except Exception as e:
        session.rollback()
        raise ValueError(f"Error adding user account data: {str(e)}")


# deleting row in database 
def delete_row(session, table_class, column_name, value):
    column = getattr(table_class, column_name, None)
    if column is None:
        print(f"Column '{column_name}' not found in table '{table_class.__tablename__}'")
        return
    session.query(table_class).filter(column == value).delete()
    session.commit()
    print(f"Deleted rows from {table_class.__tablename__} where {column_name} = {value}")


# edit row in database
def edit_row(session, table_class, identify_column, identify_value, update_dict):
    column = getattr(table_class, identify_column, None)
    if column is None:
        print(f"Column '{identify_column}' not found in table '{table_class.__tablename__}'")
        return
    
    row = session.query(table_class).filter(column == identify_value).one_or_none()
    if row is None:
        print(f"No row found in table '{table_class.__tablename__}' where {identify_column} = {identify_value}")
        return

    for key, value in update_dict.items():
        if hasattr(row, key):
            setattr(row, key, value)
        else:
            print(f"Column '{key}' not found in table '{table_class.__tablename__}'")
    
    session.commit()
    print(f"Updated row in {table_class.__tablename__} where {identify_column} = {identify_value}")

def generate_test_data(session):
    # generate test data for the 4 tables pest detection, plant plot, food waste, irrigation
    
    # generates a list of dates in iso format for a specified date range and increment
    start_date = datetime(2024, 7, 1, 0, 0, 0, tzinfo=timezone(timedelta(hours=8)))
    end_date = datetime(2024, 7, 8, 0, 0, 0, tzinfo=timezone(timedelta(hours=8)))
    dates = (start_date + timedelta(minutes=i*30) for i in range((end_date - start_date).days * 24 * 2 + 1))

    for i, date in enumerate(dates):
        timestamp = datetime.now(timezone(timedelta(hours=8))).isoformat()

        insert_pest_detection_data(session, device_id="BBBW2", garden_id="NYP", pest_detected=random.choice([True, False]), buzzer_status=random.choice([True, False]) , timestamp=timestamp)
        insert_bin_data(session, device_id="BBBW5", garden_id="NYP", bin_opened=random.choice([True, False]), bin_percentage_filled=float(random.randint(1, 100)), weight=float(random.randint(1, 100)), timestamp=timestamp)
        insert_irrigation_data(session, device_id="BBBW3", garden_id="NYP", tank_percentage_filled=float(random.randint(1, 100)), flame_detected=random.choice([True, False]), timestamp=timestamp)
        insert_plant_plot_data(session, device_id="BBBW4", plot_id="1", garden_id="NYP", moisture_value=float(random.randint(1, 100)), plant_height=float(random.randint(1, 100)), light_value=float(random.randint(1, 100)), temperature_value=float(random.randint(1, 100)), timestamp=timestamp)

    test_tasks = [
        {
            "title": "Refill Tank",
            "status": "todo",
            "label": "Maintenance",
            "priority": "medium",
            "garden_id": "NYP"
        },
        {
            "title": "Empty Food Waste bin",
            "status": "todo",
            "label": "Maintenance",
            "priority": "medium",
            "garden_id": "NYP"
        },
        {
            "title": "Repair the Fence",
            "status": "in progress",
            "label": "Maintenance",
            "priority": "high",
            "garden_id": "NYP"
        },
        {
            "title": "Collect the compost",
            "status": "todo",
            "label": "Maintenance",
            "priority": "medium",
            "garden_id": "NYP"
        },
        {
            "title": "Daily Maintenance",
            "status": "in progress",
            "label": "Maintenance",
            "priority": "medium",
            "garden_id": "NYP"
        },
        {
            "title": "Admin Routine Check",
            "status": "todo",
            "label": "Maintenance",
            "priority": "high",
            "garden_id": "NYP"
        },
        {
            "title": "Rake Leaves",
            "status": "in progress",
            "label": "Maintenance",
            "priority": "high",
            "garden_id": "NYP"
        },
        {
            "title": "Clean Tools",
            "status": "todo",
            "label": "Maintenance",
            "priority": "medium",
            "garden_id": "NYP"
        },
        {
            "title": "Repair Barrels",
            "status": "todo",
            "label": "Maintenance",
            "priority": "low",
            "garden_id": "NYP"
        },
        {
            "title": "Buy new equipment",
            "status": "in progress",
            "label": "Maintenance",
            "priority": "high",
            "garden_id": "NYP"
        },
        {
            "title": "Repair Food Waste Bin",
            "status": "todo",
            "label": "Maintenance",
            "priority": "medium",
            "garden_id": "NYP"
        },
        {
            "title": "Plan Spring event",
            "status": "in progress",
            "label": "Events",
            "priority": "medium",
            "garden_id": "NYP"
        },
        {
            "title": "Friday Meetup",
            "status": "todo",
            "label": "Events",
            "priority": "medium",
            "garden_id": "NYP"
        }
    ]

    for task in test_tasks:
        insert_task_board_data(session=session,
                               device_id="BBBW1",
                               garden_id=task.get('garden_id'),
                               title=task.get('title'),
                               status=task.get('status'),
                               label=task.get('label'),
                               priority=task.get('priority'),
                               timestamp=datetime.now(sg_timezone).isoformat())

# delete_all_rows(PestDetectionData)
# delete_all_rows(PlantPlotData)
# delete_all_rows(FoodWasteBinData)
# delete_all_rows(IrrigationData)
# delete_all_rows(TaskBoard)
# delete_all_rows(NYPGarden)
# delete_all_rows(YCKGarden)
# delete_all_rows(UserAccounts)


# add_device(session=Session(), device_id="BBBW2", plot_id=None, garden_id="NYP", description="Determines if a Pest is in the garden")
# add_device(session=Session(), device_id="BBBW3", plot_id=None, garden_id="NYP", description="Auto irrigation system")
# add_device(session=Session(), device_id="BBBW4", plot_id=1, garden_id="NYP", description="Collects soil data")
# add_device(session=Session(), device_id="BBBW5", plot_id=None, garden_id="NYP", description="Determines when the Food Waste Bin is full / opened /etc.")
# add_device(session=Session(), device_id="BBBW1", plot_id=None, garden_id="NYP", description="Community Garden Task Board")

# add_plots(session=Session(), garden_table=NYPGarden,  number_of_plots=10)
# add_plots(session=Session(), garden_table=YCKGarden, number_of_plots=10)

# insert_plant_plot_data(Session(), device_id="BBBW4", plot_id="1", garden_id="NYP", moisture_value=12.3, plant_height=15.6, light_value=19.2, temperature_value=32.4, timestamp="2024-07-08T21:00:00+08:00")
# insert_plant_plot_data(Session(), device_id="BBBW8", plot_id="2", garden_id="NYP", moisture_value=69.4, plant_height=25.8, light_value=30.6, temperature_value=32.6, timestamp="2024-07-08T21:00:00+08:00")

# insert_irrigation_data(Session(), "BBBW3", "NYP", 52.8, True , "2024-07-08T21:00:00+08:00")

# generate_test_data(Session())