import { Navbar } from "./Navbar";
import { Routes, Route } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import {
  Home,
  Admin,
  RegisterUser,
  LoginUser,
  Events,
  CreateEvent,
  UpdateEvent,
  Finance,
  CreateProforma,
  UpdateProforma,
  UpdateInvoice,
  CreateInvoice,
  CreateEntity,
  UpdateEntity,
  Traffic,
  CreateTraffic,
  UpdateTraffic,
  Merch,
  CreateMerch,
  UpdateMerch,
  CreateOrder,
  CreateSale,
  UpdateSale,
  UpdateOrder,
  MerchOrders,
  MerchSales,
  Debts,
  UpdateDebt,
  DebtPay,
  DebtDeposit,
  DebtBuy,
  DebtCashout,
  Black,
  DebtActions,
  CreateBlackFlow,
  UpdateBlackFlow,
  Trips,
  DataManagement,
} from "./pages";
import "./App.css";

function App() {
  return (
    <div className="page-container">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginUser />} />

        <Route element={<PersistLogin />}>
          <Route index element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id/edit" element={<UpdateEvent />} />
          <Route path="/traffic" element={<Traffic />} />
          <Route path="/traffic/create" element={<CreateTraffic />} />
          <Route path="/traffic/:id/edit" element={<UpdateTraffic />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/entities/create" element={<CreateEntity />} />
          <Route path="/entities/:id/edit" element={<UpdateEntity />} />
          <Route path="/invoices/create/:id" element={<CreateInvoice />} />
          <Route path="/invoices/:id/edit" element={<UpdateInvoice />} />
          <Route path="/proforma/create" element={<CreateProforma />} />
          <Route path="/proforma/:id/edit" element={<UpdateProforma />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/merch/create" element={<CreateMerch />} />
          <Route path="/merch/:id/edit" element={<UpdateMerch />} />
          <Route path="/merch/orders/create" element={<CreateOrder />} />
          <Route path="/merch/orders" element={<MerchOrders />} />
          <Route path="/merch/orders/:id/edit" element={<UpdateOrder />} />
          <Route path="/merch/sales" element={<MerchSales />} />
          <Route path="/merch/sales/create" element={<CreateSale />} />
          <Route path="/merch/sales/:id/edit" element={<UpdateSale />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/black" element={<Black />} />
          <Route path="/black/flow/create" element={<CreateBlackFlow />} />
          <Route path="/black/flow/:id/edit" element={<UpdateBlackFlow />} />
          <Route path="/debts" element={<Debts />} />
          <Route path="/debts/:id/edit" element={<UpdateDebt />} />
          <Route path="/debt-actions" element={<DebtActions />} />
          <Route path="/debts/pay" element={<DebtPay />} />
          <Route path="/debts/deposit" element={<DebtDeposit />} />
          <Route path="/debts/buy" element={<DebtBuy />} />
          <Route path="/debts/cashout" element={<DebtCashout />} />
          <Route path="/debts/status" element={<Debts />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/data-management" element={<DataManagement />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
