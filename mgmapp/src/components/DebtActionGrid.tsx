import useAuth from "../hooks/useAuth";
import { NavLink } from "react-router-dom";

const DebtActionGrid = () => {
  const { auth } = useAuth();

  return (
    <div className="grid-b mw800">
      <div></div>
      <div>
        <p className="bright-text">
          Zaloga črnega fonda <b>se ne</b> spremeni
        </p>
      </div>
      <div>
        <p className="bright-text">
          Zaloga črnega fonda <b>se</b> spremeni
        </p>
      </div>
      <div></div>
      <div className="flex justify-end align-center">
        <h1 className="bright-text">+</h1>
      </div>
      <NavLink to={"/debts/pay"}>
        <div className="grid-b-item coluflex justify-between no-decor glow-hover height-100 dark-back">
          <h4 className="bright-text">Plačilo storitve</h4>
          <p className="bright-text">
            {auth.name} namesto banda iz svojega žepa plača (npr. pijačo ali
            boost na fb postu...)
          </p>
        </div>
      </NavLink>
      <NavLink to={"/debts/deposit"}>
        <div className="grid-b-item coluflex justify-between no-decor glow-hover height-100 dark-back">
          <h4 className="bright-text">Polog</h4>
          <p className="bright-text">
            {auth.name} vrne denar v fond ali prispeva vanj iz nam neznanega
            razloga.
          </p>
        </div>
      </NavLink>
      <div></div>
      <div className="flex justify-end align-center">
        <h1 className="bright-text mar-btm30">
          <b>_</b>
        </h1>
      </div>
      <NavLink to={"/debts/buy"}>
        <div className="grid-b-item coluflex justify-between no-decor glow-hover height-100 dark-back">
          <h4 className="bright-text">Nabava na društvo</h4>
          <p className="bright-text">
            {auth.name} si kupi nekaj na društvo. To društvo kupi z belim fondom
            in se na črnem ne pozna.
          </p>
        </div>
      </NavLink>
      <NavLink to={"/debts/cashout"}>
        <div className="grid-b-item coluflex justify-between no-decor glow-hover height-100 dark-back">
          <h4 className="bright-text">Keš na roko</h4>
          <p className="bright-text">
            Zaradi finančne stiske ali trdo zasluženega vložka {auth.name} vzame
            določen znesek iz črnega fonda.
          </p>
        </div>
      </NavLink>
      <div></div>
    </div>
  );
};

export default DebtActionGrid;
