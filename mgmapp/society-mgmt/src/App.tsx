import { Navbar } from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  Invoices,
  CreateEntity,
  UpdateEntity,
  UpdateInvoice,
  CreateInvoice,
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
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/entities/create" element={<CreateEntity />} />
        <Route path="/entities/:id/edit" element={<UpdateEntity />} />
        <Route path="/invoices/create" element={<CreateInvoice />} />
        <Route path="/invoices/:id/edit" element={<UpdateInvoice />} />
        <Route path="/black" element={<Black />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </div>
  );
}

export default App;
