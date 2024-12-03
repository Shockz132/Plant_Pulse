"use client"

import io from "@/logic/socket";

import { useState, useEffect } from 'react';
import PestImage from "@/assets/Dashboard-images/Pest.png";
import PestDetectedImage from "@/assets/Dashboard-images/PestDetected.png";
import BinClosed from "@/assets/Dashboard-images/bin_closed.png";
import BinOpened from "@/assets/Dashboard-images/bin_opened.png";
import NoFire from "@/assets/Dashboard-images/no_fire.png";
import YesFire from "@/assets/Dashboard-images/yes_fire.png";
import Image from "next/image";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { BarGraph, ProgressCircle, LineGraph } from "./Graphs"
import { useParams, useRouter } from "next/navigation";

interface FoodWasteBinData {
  timestamp: string,
  weight: number,
  bin_opened: boolean,
  bin_percentage_filled: number,
  fill?: string
}

interface IrrigationTankData {
  time: string,
  tank_percentage_filled: number,
  flame_detected: boolean,
  fill?: string
}

interface PlantPlotData {
  timestamp: string,
  moisture_value: number,
  temperature_value: number,
  light_value: number,
  plant_height: number
}

interface PestDetectionData {
  timestamp: string,
  pest_detected: boolean,
  buzzer_status: string,
  garden_id: string
}

const Pest_images = [PestImage, PestDetectedImage];
const texts = ["No Pest Detected", "Pest Detected!!!"];
const sizes = [170, 210];

const Bin_images = [BinClosed, BinOpened];
const Bin_texts = ["Bin Closed", "Bin Opened"];

const fireImages = [NoFire, YesFire];
const Fire_texts = ["No Fire", "FIRE!!"];

function formatTime(timestamp : string) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }).replace(/,/, '');
};

let timeNow = formatTime(new Date().toISOString());

export const GridLayout = () => {
  const user_id = sessionStorage.getItem('user_id');
  const router = useRouter();
  const params = useParams<{ garden_id: string; plot_id: string }>();

  if (!user_id && params.garden_id != "Demo" && params.plot_id != "Demo") {
    router.push('/NotLoggedIn');
  }

  const [currentTime, setCurrentTime] = useState<String>(timeNow);

  const [currentIndexPest, setCurrentIndexPest] = useState(0);
  const [currentIndexBin, setCurrentIndexBin] = useState(0);
  const [FireImageIndex, setFireImageIndex] = useState(0);
  
  const [PlantPlotData, setPlantPlotData] = useState<PlantPlotData[]>([]);
  const [IrrigationTankData, setIrrigationTankData] = useState<IrrigationTankData[]>([]);
  
  const [PestDetectionData, setPestDetectionData] = useState<PestDetectionData[]>([]);
  
  const [FoodWasteBinData, setFoodWasteBinData] = useState<FoodWasteBinData[]>([]);
  const [FoodWasteBinWeight, setFoodWasteBinWeight] = useState<Number>(0);
  
  if (params.garden_id != "Demo" && params.plot_id != "Demo") {
    useEffect(() => {
      const updateCurrentTimeInterval = setInterval(() => {
        setCurrentTime(formatTime(new Date().toISOString()));
      }, 1000);
  
      io.emit("fetchGraphData", {
        garden_id: params.garden_id,
        plot_id: params.plot_id
        }
      );
  
      io.on("updateGraphData", (data) => {
        setPlantPlotData(data.plant_plot_data);
        setIrrigationTankData(data.irrigation_tank_data);
        setPestDetectionData(data.pest_detection_data);
        setFoodWasteBinData(data.food_waste_bin_data);
  
        if (data.pest_detection_data.length > 0) {
          setCurrentIndexPest(data.pest_detection_data[data.pest_detection_data.length - 1].pest_detected ? 1 : 0);
        }
        if (data.food_waste_bin_data.length > 0) {
          setCurrentIndexBin(data.food_waste_bin_data[data.food_waste_bin_data.length - 1].bin_opened ? 1 : 0);
          setFoodWasteBinWeight(data.food_waste_bin_data[data.food_waste_bin_data.length - 1].weight);
        }
        if (data.irrigation_tank_data.length > 0) {
          setFireImageIndex(data.irrigation_tank_data[data.irrigation_tank_data.length - 1].flame_detected ? 1 : 0);
        }
      });
  
      return () => {
          io.off("updateGraphData")
          clearInterval(updateCurrentTimeInterval);
          
        };
    }, [currentTime]);  
  }
  else {
    useEffect(() => {
      const updateDemoTimeInterval = setInterval(() => {
        setCurrentTime(formatTime(new Date().toISOString()));
      }, 5000);

      const testPlantPlotData = Array.from({ length: 20 }, (_, i) => ({
          timestamp: new Date(new Date().getTime() - (20 - i) * 1000 * 60 * 60).toISOString(),
          moisture_value: Math.floor(Math.random() * 100),
          temperature_value: Math.floor(Math.random() * 25) + 15,
          light_value: Math.floor(Math.random() * 100),
          plant_height: Math.floor(Math.random() * 100)
        }));
      const testIrrigationTankData = Array.from({ length: 20 }, (_, i) => ({
          time: new Date(new Date().getTime() - (20 - i) * 1000 * 60 * 60).toISOString(),
          tank_percentage_filled: Math.floor(Math.random() * 100),
          flame_detected: Math.random() > 0.5
        }));
      const testPestDetectionData = Array.from({ length: 20 }, (_, i) => ({
          timestamp: new Date(new Date().getTime() - (20 - i) * 1000 * 60 * 60).toISOString(),
          pest_detected: Math.random() > 0.5,
          buzzer_status: Math.random() > 0.5 ? "ON" : "OFF",
          garden_id: "Demo"
        }));
      const testFoodWasteBinData = Array.from({ length: 20 }, (_, i) => ({
          timestamp: new Date(new Date().getTime() - (20 - i) * 1000 * 60 * 60).toISOString(),
          weight: Math.floor(Math.random() * 100),
          bin_opened: Math.random() > 0.5,
          bin_percentage_filled: Math.floor(Math.random() * 100),
        }));
      setPlantPlotData(testPlantPlotData);
      setIrrigationTankData(testIrrigationTankData);
      setPestDetectionData(testPestDetectionData);
      setFoodWasteBinData(testFoodWasteBinData);
      setCurrentIndexPest(Math.floor(Math.random() * 2));
      setCurrentIndexBin(Math.floor(Math.random() * 2));
      setFoodWasteBinWeight(Math.floor(Math.random() * 100));
      setFireImageIndex(Math.floor(Math.random() * 2));

    return () => {
        io.off("updateGraphData")
        clearInterval(updateDemoTimeInterval);
      };
    }, [currentTime]);
  }

  return (
    <div className="container w-full min-h-[75vh] max-h-max mt-8">
      <div className="items-center mb-4">
        <div className="flex">
          <h1 className="mr-2">Garden ID: {params.garden_id}</h1>
          <h1 className="mx-2">Plot ID: {params.plot_id}</h1>
          <h1 className="ml-2">current time: {currentTime}</h1>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4">
        <Card className="col-span-1 text-center">
          <CardHeader>
            <CardTitle>Food Waste Bin</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Image
            src={Bin_images[currentIndexBin]}
            alt="bin image"
            >
            </Image>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p>{Bin_texts[currentIndexBin]}</p>
          </CardFooter>
        </Card>

        <Card className="col-span-1 text-center">
          <CardHeader>
            <CardTitle>Food Waste Bin</CardTitle>
            <CardDescription>Current Weight:</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl">{FoodWasteBinWeight.toString()}g</p>
          </CardContent>
          <CardFooter>
            <p></p>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-center">Fire Alarm</CardTitle>
            <CardDescription className="text-destructive text-2xl font-semibold text-center">LIVE</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Image
            src={fireImages[FireImageIndex]}
            alt="fireImage"
            >
            </Image>
          </CardContent>
          <CardFooter className="flex justify-center text-2xl">{Fire_texts[FireImageIndex]}</CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            Card Content
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-7 md:grid-cols-1 gap-4 mt-4">
        <Card className="lg:col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle>{"Plant Height (cm)"}</CardTitle>
            <CardDescription>
              last updated: {PlantPlotData[PlantPlotData.length - 1] != undefined ? formatTime(PlantPlotData[PlantPlotData.length - 1].timestamp) : "could not fetch time" }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarGraph data={PlantPlotData} datakey="plant_height" />
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-3 md:col-span-1">
          <CardHeader>
          <CardTitle>Pest Detection</CardTitle>
            <div className="flex justify-between items-center">
              <CardDescription className="text-destructive text-2xl font-semibold">LIVE</CardDescription>
              <div className="flex-1"></div>
                <div className="flex items-center">
                  <span className="font-bold text-base">
                    Buzzer Status: {PestDetectionData[PestDetectionData.length - 1] != undefined ? (PestDetectionData[PestDetectionData.length - 1].buzzer_status === "1" ? "ON" : "OFF") : "not set" }
                  </span>
                </div> 
            </div>
          </CardHeader>
          <CardContent>
            <Image 
              src={Pest_images[currentIndexPest]} 
              alt="Pest Detection"
              width={sizes[currentIndexPest]} 
              height={sizes[currentIndexPest]}
              className="m-auto">
            </Image>      
          </CardContent>
          <CardFooter>
            <p className="m-auto text-3xl font-bold mt-8">{texts[currentIndexPest]}</p>
          </CardFooter>
        </Card>
      </div>

      <div className="grid lg:grid-cols-8 md:grid-cols-1 gap-4 mt-4">
        <Card className="lg:col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle>{"Temperature (°C)"}</CardTitle>
            <CardDescription>
              last updated: {PlantPlotData[PlantPlotData.length - 1] != undefined ? formatTime(PlantPlotData[PlantPlotData.length - 1].timestamp) : "could not fetch time" }
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-1 pb-0">
            <BarGraph data={PlantPlotData} datakey="temperature_value"/>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card className="lg:col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle>{"Light (lux)"}</CardTitle>
            <CardDescription>
              last updated: {PlantPlotData[PlantPlotData.length - 1] != undefined ? formatTime(PlantPlotData[PlantPlotData.length - 1].timestamp) : "could not fetch time" }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineGraph data={PlantPlotData} datakey="light_value" />
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-8 md:grid-cols-1 gap-4 mt-4">
        <Card className="lg:col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle>Irrigation Tank</CardTitle>
            <CardDescription className="text-destructive text-2xl font-semibold">LIVE</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressCircle data={IrrigationTankData} datakey="tank_percentage_filled"/>
          </CardContent>
          <CardFooter>
            <p></p>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle>Food Waste Bin</CardTitle>
            <CardDescription className="text-destructive text-2xl font-semibold">LIVE</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressCircle data={FoodWasteBinData} datakey="bin_percentage_filled"/>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>

      <div className="grid lg:grid-cols-8 md:grid-cols-1 gap-4 mt-4">
        <Card className="lg:col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle>{"Moisture (g/cm³)"}</CardTitle>
            <CardDescription>
              last updated: {PlantPlotData[PlantPlotData.length - 1] != undefined ? formatTime(PlantPlotData[PlantPlotData.length - 1].timestamp) : "could not fetch time" }
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-1 pb-0">
            <BarGraph data={PlantPlotData} datakey="moisture_value"/>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card className="lg:col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle>{"Weight (g)"}</CardTitle>
            <CardDescription>
              last updated: {FoodWasteBinData[FoodWasteBinData.length - 1] != undefined ? formatTime(FoodWasteBinData[FoodWasteBinData.length - 1].timestamp) : "could not fetch time" }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineGraph data={FoodWasteBinData} datakey="weight" />
          </CardContent>
          <CardFooter>
            <p></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}