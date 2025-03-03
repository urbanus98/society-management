import { useEffect, useState } from "react";
import DebtActionGrid from "../components/DebtActionGrid";
import DebtForm from "../components/Forms/DebtForm";
import SubNavigator from "../components/SubNavigator";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DebtChart from "../components/DebtChart";
import FinanceTable from "../components/ui/FinanceTable";
import { useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import BackWTitle from "../components/BackWTitle";

export const Debts = () => {
  const axiosPrivate = useAxiosPrivate();
  const [debts, setDebts] = useState<any[]>([]);
  const [debtRows, setDebtsRows] = useState<any[]>([]);
  const left = { link: "/black", text: "Črn fond" };
  const right = { link: "/debt-actions", text: "Vnesi dolg" };
  const headers = [
    { key: "date", label: "Datum" },
    { key: "amount", label: "Znesek" },
    { key: "name", label: "Razlog" },
    { key: "user", label: "Zakrivil" },
    { key: "id", label: "" },
  ];

  useEffect(() => {
    const getDebts = async () => {
      const response = await axiosPrivate.get("debts");
      setDebts(response.data);
      const responseRows = await axiosPrivate.get("debts/rows");
      setDebtsRows(responseRows.data);
      console.log(response.data);
    };

    getDebts();
  }, []);

  return (
    <div className="padding-3">
      <SubNavigator left={left} right={right} title="Dolgovi" />
      <div className=" coluflex justify-center align-center height-full">
        <div className="white-back2 padding-5 border-radius flex justify-center mw700 width-100">
          <DebtChart debtData={debts} />
        </div>
        <div className="flex padding-tb2" key={"debtdiv"}>
          {debts.map((debt: any) => (
            <div
              className="coluflex justify-center align-center padding-lr2"
              key={debt.id}
            >
              <h3 className="bright-text" key={debt.id}>
                {debt.name}:
              </h3>
              <h4 className="bright-text" key={debt.id}>
                {debt.credit - debt.debt + Number(debt.tripCosts)} €
              </h4>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mw800 width-100 mh450 scrollable">
          <FinanceTable headers={headers} rows={debtRows} linkPart="debts" />
        </div>
      </div>
    </div>
  );
};

export const UpdateDebt = () => {
  const axiosPrivate = useAxiosPrivate();
  const [debt, setDebt] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    const getDebt = async () => {
      const response = await axiosPrivate.get(`debts/${id}`);
      setDebt(response.data);
    };

    getDebt();
  }, []);

  if (!debt) {
    return <Loading />;
  }

  return (
    <div className="padding-3">
      <BackWTitle title="Uredi dolg" />
      <div className="height-100 cpad flex justify-center align-center">
        <DebtForm debt={debt} action="" />
      </div>
    </div>
  );
};

export const DebtActions = () => {
  const axiosPrivate = useAxiosPrivate();
  const left = { link: "/debts", text: "Dolgovi" };
  const right = { link: "/black", text: "Črn fond" };

  useEffect(() => {
    const getDummy = async () => {
      await axiosPrivate.get("dummy"); // TODO remove
    };

    getDummy();
  }, []);

  return (
    <div className="height-full padding-3">
      <SubNavigator left={left} right={right} title="Izberi akcijo" />

      <div className="height-100 cpad flex justify-center align-center">
        <DebtActionGrid />
      </div>
    </div>
  );
};

export const DebtPay = () => {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Plačaj" />
      <div className="res-width-30">
        <DebtForm action="pay" />
      </div>
    </div>
  );
};

export const DebtDeposit = () => {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Nakaži" />
      <div className="res-width-30">
        <DebtForm action="deposit" />
      </div>
    </div>
  );
};

export const DebtBuy = () => {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Kupi" />
      <div className="res-width-30">
        <DebtForm action="buy" />
      </div>
    </div>
  );
};

export const DebtCashout = () => {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Izplačaj" />
      <div className="res-width-30">
        <DebtForm action="cashout" />
      </div>
    </div>
  );
};
