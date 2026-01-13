import "./header.css";
import { Link } from "react-router";

const Header = () => {
	return (
		<header>
			<h1>
				<Link to="/">MyBooking</Link>
			</h1>
			<div className="navBar">
				<Link to="/">Salles</Link>
				<Link to="/person/reservation">Mes reservation</Link>
			</div>
		</header>
	);
};

export default Header;
