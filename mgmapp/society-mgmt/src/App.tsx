import { Navbar } from "./Navbar";
import { Routes, Route } from "react-router-dom";
import {
  Home,
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
  SellMerch,
  Black,
  Stats,
} from "./pages";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
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
        <Route path="/merch/sell" element={<SellMerch />} />
        <Route path="/black" element={<Black />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </div>
  );
}

export default App;
