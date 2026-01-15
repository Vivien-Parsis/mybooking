import "./footer.css";

const Footer = () => {
	const handleDisconnect = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.reload();
	};

	return (
		<footer className="footerComponent">
            <button onClick={handleDisconnect} className="disconnectButton">Se deconnecter</button>
		</footer>
	);
};

export default Footer;
