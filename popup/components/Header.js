import Settings from "./icons/Settings"

import "../styles/header.scss";

function Header() {
	return <div className="header flex align-center justify-between">
		<h1>Leetcode Solver</h1>
		<Settings classes="settings__icon" />
	</div>
}

export default Header;