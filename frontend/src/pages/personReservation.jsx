import { Link, useNavigate } from "react-router";
import "./personReservation.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config/server";

const Room = () => {
	const navigate = useNavigate();
	const [reservations, setReservations] = useState([]);
	const token = localStorage.getItem("token");

	const showReservations = () => {
		if (!reservations) {
			return [];
		}

		const now = new Date().toISOString();
		const upcoming = [];
		const past = [];

		reservations.forEach((r) => {
			if (r.date.split("T")[0] >= now.split("T")[0]) {
				upcoming.push(r);
			} else {
				past.push(r);
			}
		});

		upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
		past.sort((a, b) => new Date(a.date) - new Date(b.date));

		const sortedReservations = [];
		if (upcoming.length > 0) {
			sortedReservations.push(<h2>Prochaines réservations</h2>);
			for (let l of upcoming) {
				sortedReservations.push(
					<div key={l._id}>
						<ul>
							<li>Salles : {l.room.name || "?"}</li>
							<li>Date : {l.date.split("T")[0] || "?"}</li>
							<li>
								Heure: {l.hour} - {l.endHour}
							</li>
							<li>Capacité : {l.room.capacity || "?"}</li>
						</ul>
						<button onClick={() => deleteReservation(l._id)}>
							Supprimer
						</button>
					</div>
				);
			}
		}
		if (past.length > 0) {
			sortedReservations.push(<h2>Réservations passées</h2>);
			for (let l of past) {
				sortedReservations.push(
					<div key={l._id}>
						<ul>
							<li>Salles : {l.room.name || "?"}</li>
							<li>Date : {l.date.split("T")[0] || "?"}</li>
							<li>
								Heure: {l.hour} - {l.endHour}
							</li>
							<li>Capacité : {l.room.capacity || "?"}</li>
						</ul>
						<button onClick={() => deleteReservation(l._id)}>
							Supprimer
						</button>
					</div>
				);
			}
		}

		return sortedReservations;
	};

	const deleteReservation = async (id) => {
		const req = await axios.delete(`${apiUrl}/reservation/person`, {
			headers: { authorization: "Bearer " + token },
			data: { id }
		});
		if (req.status === 200) {
			alert("Reservation supprimée");
			setReservations(reservations.filter((r) => r._id !== id));
		} else {
			alert("Erreur lors de la suppression de la reservation");
		}
	};

	useEffect(() => {
		const fetchReservations = async () => {
			if (!token) {
				console.log("erreur avec le token");
				return;
			} else {
				await axios
					.get(`${apiUrl}/reservation/person/`, {
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
		};
		fetchReservations();
	}, [token, navigate]);

	return (
		<div className="personReservation">
			{showReservations()}
		</div>
	);
};

export default Room;
