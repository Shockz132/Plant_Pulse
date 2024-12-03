import { io } from "socket.io-client";

const SOCKET_URL = "http://192.168.0.172:5000"; // enter flask server address
const socket = io(SOCKET_URL);

export default socket;