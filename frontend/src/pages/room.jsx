import { Link, useNavigate } from "react-router";
import "./room.css";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { apiUrl } from "../config/server";

const Room = () => {
	const navigate = useNavigate();
	const [rooms, setRooms] = useState([]);
	const [reservations, setReservations] = useState([]);
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const token = localStorage.getItem("token");

	const slots = [
		{ start: 0, end: 6, label: "00h - 06h" },
		{ start: 6, end: 12, label: "06h - 12h" },
		{ start: 12, end: 18, label: "12h - 18h" },
		{ start: 18, end: 24, label: "18h - 00h" }
	];

	const fetchReservations = useCallback(() => {
		if (!token) {
			console.log("erreur avec le token");
			return;
		} else {
			axios
				.get(`${apiUrl}/reservation`, {
					headers: { authorization: "Bearer " + token }
				})
				.then((res) => {
					setReservations(res.data);
				})
				.catch(() => {
					console.log(
						"erreur lors de la récupération des reservations"
					);
					localStorage.removeItem("token");
					navigate("/login");
				});
		}
	}, [token, navigate]);
	const handleDateChange = (e) => {
		fetchReservations();
		setSelectedDate(e.target.value);
	};

	const handleReserve = () => {
		if (!selectedSlot) return;
		axios
			.post(
				`${apiUrl}/reservation/person/add`,
				{
					room: selectedSlot.roomId,
					date: selectedDate,
					hour: selectedSlot.start,
					endHour: selectedSlot.end
				},
				{ headers: { authorization: "Bearer " + token } }
			)
			.then(() => {
				alert("Réservation confirmée !");
				setSelectedSlot(null);
				fetchReservations();
			})
			.catch((err) => {
				console.error(err);
				alert("Erreur lors de la réservation");
			});
	};

	const isSlotReserved = (roomId, start) => {
		return reservations.some((res) => {
			const resRoomId = res.room?._id || res.room;
			return (
				resRoomId === roomId &&
				res.date.split("T")[0] === selectedDate &&
				(res.hour === start ||
					(res.hour < start + 6 && res.endHour > start))
			);
		});
	};

	const showRooms = () => {
		if (!rooms) return null;

		return rooms.map((r) => (
			<div key={r._id} className="room-card">
				<ul>
					<li>Nom : {r.name || "?"}</li>
					<li>Batiment : {r.building || "?"}</li>
					<li>Etage : {r.floor || "?"}</li>
					<li>Capacité : {r.capacity || "?"}</li>
				</ul>
				<div className="slots-container">
					{slots.map((slot) => {
						const reserved = isSlotReserved(r._id, slot.start);
						const isSelected =
							selectedSlot?.roomId === r._id &&
							selectedSlot?.start === slot.start;
						return (
							<button
								key={slot.start}
								className={`slot-btn ${
									isSelected ? "selected" : ""
								} ${reserved ? "reserved" : ""}`}
								disabled={reserved}
								onClick={() =>
									setSelectedSlot({
										roomId: r._id,
										start: slot.start,
										end: slot.end
									})
								}
								style={{
									margin: "5px",
									backgroundColor: reserved
										? "#ccc"
										: isSelected
										? "#4CAF50"
										: "#f0f0f0",
									color: isSelected ? "white" : "black",
									cursor: reserved ? "not-allowed" : "pointer"
								}}
							>
								{slot.label}
							</button>
						);
					})}
				</div>
			</div>
		));
	};

	useEffect(() => {
		const fetchRooms = async () => {
			if (!token) {
				console.log("erreur avec le token");
				return;
			} else {
				await axios
					.get(`${apiUrl}/room`, {
						headers: { authorization: "Bearer " + token }
					})
					.then((res) => {
						setRooms(res.data);
					})
					.catch(() => {
						console.log("erreur lors de la récupération des rooms");
						localStorage.removeItem("token");
						navigate("/login");
					});
			}
		};
		fetchRooms();
		fetchReservations();
	}, [token, navigate, fetchReservations]);

	return (
		<div className="room">
			<h2>Salles</h2>
			<input
				type="date"
				value={selectedDate}
				onChange={handleDateChange}
			/>
			{selectedSlot && (
				<div style={{ margin: "20px 0" }}>
					<button
						onClick={handleReserve}
						style={{
							padding: "10px 20px",
							fontSize: "16px",
							backgroundColor: "#007BFF",
							color: "white",
							border: "none",
							borderRadius: "5px",
							cursor: "pointer"
						}}
					>
						Confirmer la réservation
					</button>
				</div>
			)}
			{showRooms()}
		</div>
	);
};

export default Room;
