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
  Invoices,
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
  OrderMerch,
  CreateSale,
  UpdateSale,
  UpdateOrder,
  MerchOrders,
  MerchSales,
  Black,
  Stats,
} from "./pages";
import "./App.css";

function App() {
  return (
    <div>
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
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/entities/create" element={<CreateEntity />} />
          <Route path="/entities/:id/edit" element={<UpdateEntity />} />
          <Route path="/invoices/create" element={<CreateInvoice />} />
          <Route path="/invoices/:id/edit" element={<UpdateInvoice />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/merch/create" element={<CreateMerch />} />
          <Route path="/merch/:id/edit" element={<UpdateMerch />} />
          <Route path="/merch/orders/create" element={<OrderMerch />} />
          <Route path="/merch/orders" element={<MerchOrders />} />
          <Route path="/merch/orders/:id/edit" element={<UpdateOrder />} />
          <Route path="/merch/sales" element={<MerchSales />} />
          <Route path="/merch/sales/create" element={<CreateSale />} />
          <Route path="/merch/sales/:id/edit" element={<UpdateSale />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/black" element={<Black />} />
          <Route path="/stats" element={<Stats />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
