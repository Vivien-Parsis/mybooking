import { Routes, Route } from "react-router";
import "./App.css";
import ProtectedRoute from "./components/protectedRoute";
import Login from "./pages/login";
import Register from "./pages/register";
import Header from "./components/header";
import Room from "./pages/room";
import PersonReservation from "./pages/personReservation";

function App() {
	return (
		<>
			<Header />
			<Routes>
				<Route
					path="/login"
					element={
						<>
							<Login />
						</>
					}
				/>
				<Route
					path="/register"
					element={
						<>
							<Register />
						</>
					}
				/>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Room />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/person/reservation"
					element={
						<ProtectedRoute>
							<PersonReservation />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
