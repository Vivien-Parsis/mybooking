import { useState } from "react";
import "./register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../config/server";
import { passwordPattern } from "../config/pattern";

const Register = () => {
	const [registerError, setRegisterError] = useState("");
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		lastName: "",
		firstName: ""
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setRegisterError("");
		console.log(
			passwordPattern.test(formData.password),
			passwordPattern,
			formData.password
		);
		if (
			!formData.password ||
			!formData.email ||
			!formData.confirmPassword ||
			!formData.lastName ||
			!formData.firstName
		) {
			console.log("manque de parametres");
		} else if (formData.password !== formData.confirmPassword) {
			console.log("mot de passes non identiques");
			setRegisterError("mot de passes non identiques");
		} else if (!passwordPattern.test(formData.password)) {
			console.log("mot de passes non conforme");
			setRegisterError("mot de passes non conforme");
		} else {
			axios
				.post(`${apiUrl}/person/register`, formData)
				.then((res) => {
					if (res.data.token) {
						localStorage.setItem("token", res.data.token);
						navigate("/");
					} else {
						console.log("erreur de connexion");
						setRegisterError("erreur de connexion");
					}
				})
				.catch(() => {
					console.log("erreur de connexion serveur");
					setRegisterError("erreur de connexion serveur");
				});
		}
	};
	return (
		<form onSubmit={handleSubmit} className="registerForm">
			<h2>Se connecter</h2>
			<label htmlFor="email">email :</label>
			<input
				type="email"
				id="email"
				name="email"
				value={formData.email}
				onChange={handleChange}
				required
			/>
			<label htmlFor="password">mot de passe :</label>
			<input
				type="password"
				id="password"
				name="password"
				value={formData.password}
				onChange={handleChange}
				required
			/>
			<label htmlFor="confirmPassword">confirmer mot de passe :</label>
			<input
				type="password"
				id="confirmPassword"
				name="confirmPassword"
				value={formData.confirmPassword}
				onChange={handleChange}
				required
			/>
			<label htmlFor="firstName">Prénom :</label>
			<input
				type="text"
				id="firstName"
				name="firstName"
				value={formData.firstName}
				onChange={handleChange}
				required
			/>
			<label htmlFor="lastName">Nom :</label>
			<input
				type="text"
				id="lastName"
				name="lastName"
				value={formData.lastName}
				onChange={handleChange}
				required
			/>
			<button type="submit">Se connecter</button>
			<Link to="/login">Deja inscrit ? se connecter</Link>
			<span style={{ color: "red" }}>{registerError}</span>
		</form>
	);
};

export default Register;
