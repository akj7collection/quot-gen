import React, { useState, type ChangeEvent } from 'react';
import jkmLogo from './assets/JKM_2.png';
import {
  Plus,
  Calculator,
  User,
  Car,
  ShieldCheck,
  Trash2,
  Printer,
  FileText,
  ChevronDown,
  type LucideIcon
} from 'lucide-react';

// --- Interfaces for TypeScript ---
interface ServiceRow {
  id: number;
  description: string;
  quantity: number;
  spares: number;
  rr: number;
  dr: number;
  cw: number;
  painting: number;
}

interface WorkshopFormData {
  docType: string;
  name: string;
  address: string;
  quotationNo: string;
  date: string;
  vehicleNo: string;
  make: string;
  model: string;
  year: string;
  odometer: string;
  phone: string;
  insuranceCo: string;
  estimatedBy: string;
}

interface Totals {
  spares: number;
  labor: number;
  grand: number;
}

const App: React.FC = () => {
  // --- State Management ---
  const [formData, setFormData] = useState<WorkshopFormData>({
    docType: 'Quotation',
    name: '',
    address: '',
    quotationNo: 'RN-' + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString().split('T')[0],
    vehicleNo: '',
    make: '',
    model: '',
    year: '',
    odometer: '',
    phone: '',
    insuranceCo: '',
    estimatedBy: ''
  });

  const [rows, setRows] = useState<ServiceRow[]>(
    Array(5).fill(null).map((_, i) => ({
      id: i,
      description: '',
      quantity: 1,
      spares: 0,
      rr: 0,
      dr: 0,
      cw: 0,
      painting: 0
    }))
  );

  const [totals, setTotals] = useState<Totals>({ spares: 0, labor: 0, grand: 0 });

  // --- Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateRow = (id: number, field: keyof ServiceRow, value: string | number) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        const val = typeof value === 'string' ? (parseFloat(value) || 0) : value;
        return { ...row, [field]: field === 'description' ? value : val };
      }
      return row;
    }));
  };

  const addRow = () => {
    const newRow: ServiceRow = {
      id: Date.now(),
      description: '',
      quantity: 1,
      spares: 0,
      rr: 0,
      dr: 0,
      cw: 0,
      painting: 0
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const calculateTotals = () => {
    let totalSpares = 0;
    let totalLabor = 0;

    rows.forEach(row => {
      const qty = row.quantity || 0;
      totalSpares += (row.spares || 0) * qty;
      totalLabor += (row.rr || 0) +
        (row.dr || 0) +
        (row.cw || 0) +
        (row.painting || 0);
    });

    setTotals({
      spares: totalSpares,
      labor: totalLabor,
      grand: totalSpares + totalLabor
    });
  };

  // --- Helper Components ---
  const SectionHeader: React.FC<{ title: string; icon: LucideIcon; colorClass?: string }> = ({
    title, icon: Icon, colorClass = "text-blue-600 bg-blue-50"
  }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">{title}</h3>
      <div className="h-px bg-slate-100 flex-grow ml-4"></div>
    </div>
  );

  const ModernInput: React.FC<{
    label: string;
    name: keyof WorkshopFormData;
    type?: string;
    placeholder?: string;
    value: string;
    fullWidth?: boolean
  }> = ({ label, name, type = "text", placeholder, value, fullWidth = false }) => (
    <div className={`group relative ${fullWidth ? 'col-span-full' : ''}`}>
      <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300 hover:border-slate-300"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-700">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Modern Navbar */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm rounded-2xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-15 h-15 bg-gradient-to-tr rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 overflow-hidden">
              <img src={jkmLogo} alt="JK Motors" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-800 uppercase">JK</h1>
              <p className="text-[15px] font-bold text-slate-400 uppercase tracking-widest -mt-1">MOTORS</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-3xs font-bold text-slate-700">Jeyakumar T</span>
              <span className="text-[15px] text-slate-400 font-mono tracking-tight">Proprietor & Service Head</span>
            </div>
            <button className="p-2.5 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-600 border border-slate-200">
              <User size={18} />
            </button>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Panel: Customer & Doc Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100">
              <SectionHeader title="Document & Client" icon={FileText} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <select
                    name="docType"
                    value={formData.docType}
                    onChange={handleInputChange}
                    className="w-full appearance-none px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-800 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option>Customer Supplementary Estimation</option>
                    <option>Customer Estimation</option>
                    <option>Cash Bill</option>
                    <option>Invoice</option>
                    <option>Invoice Performa</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-blue-400 pointer-events-none" size={16} />
                </div>
                <ModernInput label="Date" type="date" name="date" value={formData.date} />
                <ModernInput label="Reference No." name="quotationNo" value={formData.quotationNo} />
                <ModernInput label="Advisor / Estimator" name="estimatedBy" value={formData.estimatedBy} placeholder="e.g. Mike Ross" />
                <ModernInput label="Customer Name" name="name" value={formData.name} placeholder="Client Full Name" />
                <ModernInput label="Contact Number" name="phone" value={formData.phone} placeholder="+91 00000 00000" />
                <ModernInput label="Billing Address" name="address" value={formData.address} placeholder="Full Street Address" fullWidth />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100">
              <SectionHeader title="Vehicle Profile" icon={Car} colorClass="text-emerald-600 bg-emerald-50" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <ModernInput label="Vehicle Reg. No." name="vehicleNo" value={formData.vehicleNo} placeholder="AB 01 CD 1234" />
                <ModernInput label="Odometer (km)" name="odometer" value={formData.odometer} placeholder="00,000" />
                <ModernInput label="Model Year" name="year" value={formData.year} placeholder="YYYY" />
                <ModernInput label="Make / Brand" name="make" value={formData.make} placeholder="e.g. Toyota" />
                <ModernInput label="Model Variant" name="model" value={formData.model} placeholder="e.g. Fortuner 4x4" />
                <ModernInput label="Insurance Co." name="insuranceCo" value={formData.insuranceCo} placeholder="Provider Name" />
              </div>
            </div>
          </div>

          {/* Right Panel: Summary & Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-slate-300 sticky top-28 overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[70px] opacity-20 -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full blur-[60px] opacity-10 -ml-10 -mb-10"></div>

              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8 relative z-10 border-b border-slate-800 pb-2">Calculation Summary</h3>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Spares</span>
                  <span className="font-mono text-lg text-emerald-400">₹{totals.spares.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Labor</span>
                  <span className="font-mono text-lg text-blue-400">₹{totals.labor.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="pt-8 border-t border-slate-800">
                  <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Grand Total Payable</span>
                  <div className="text-5xl font-bold tracking-tight text-white flex items-baseline gap-1">
                    <span className="text-2xl font-medium text-slate-500">₹</span>
                    {totals.grand.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="pt-8 space-y-3">
                  <button
                    onClick={calculateTotals}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-[0.98]"
                  >
                    <Calculator size={18} /> Update Figures
                  </button>

                  <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-slate-700">
                    <Printer size={18} /> Print Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Table Section */}
        <section className="bg-white rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden mt-6">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Parts & Labor Breakdown</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scenario 1: Standard Estimation</p>
              </div>
            </div>
            <button
              onClick={addRow}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all text-[11px] font-black uppercase tracking-widest shadow-sm active:scale-95"
            >
              <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Add Line Item
            </button>
          </div>

          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  <th className="py-4 px-4 w-12 text-center">ID</th>
                  <th className="py-4 px-4">Description of Service / Part</th>
                  <th className="py-4 px-4 w-24 text-center">Qty</th>
                  <th className="py-4 px-4 w-36 text-right">Spares (₹)</th>
                  <th className="py-4 px-2 w-28 text-center text-blue-600 bg-blue-50/50 rounded-tl-xl border-l border-t border-blue-100">R/R</th>
                  <th className="py-4 px-2 w-28 text-center text-blue-600 bg-blue-50/50 border-t border-blue-100">D/R</th>
                  <th className="py-4 px-2 w-28 text-center text-blue-600 bg-blue-50/50 border-t border-blue-100">C/W</th>
                  <th className="py-4 px-2 w-28 text-center text-blue-600 bg-blue-50/50 rounded-tr-xl border-r border-t border-blue-100">Paint</th>
                  <th className="py-4 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className="group transition-all">
                    <td className="p-3 text-center text-slate-300 font-black text-xs">{index + 1}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.description}
                        placeholder="Service description..."
                        className="w-full bg-slate-50/50 px-4 py-3 rounded-xl outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 border border-transparent focus:border-blue-200 transition-all"
                        onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.quantity}
                        className="w-full text-center bg-slate-50/50 px-2 py-3 rounded-xl outline-none text-sm font-black text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-100 border border-transparent focus:border-blue-200 transition-all"
                        onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.spares || ''}
                        placeholder="0.00"
                        className="w-full text-right bg-slate-50/50 px-4 py-3 rounded-xl outline-none text-sm font-mono font-bold text-emerald-600 placeholder:text-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-100 border border-transparent focus:border-emerald-200 transition-all"
                        onChange={(e) => updateRow(row.id, 'spares', e.target.value)}
                      />
                    </td>
                    {/* Labor Group Inputs */}
                    <td className="p-2 bg-blue-50/20 border-l border-blue-50 group-hover:bg-blue-50/40 transition-colors">
                      <input type="number" value={row.rr || ''} placeholder="0" className="w-full text-center bg-transparent outline-none text-xs font-bold text-blue-700 placeholder:text-blue-200" onChange={(e) => updateRow(row.id, 'rr', e.target.value)} />
                    </td>
                    <td className="p-2 bg-blue-50/20 group-hover:bg-blue-50/40 transition-colors">
                      <input type="number" value={row.dr || ''} placeholder="0" className="w-full text-center bg-transparent outline-none text-xs font-bold text-blue-700 placeholder:text-blue-200" onChange={(e) => updateRow(row.id, 'dr', e.target.value)} />
                    </td>
                    <td className="p-2 bg-blue-50/20 group-hover:bg-blue-50/40 transition-colors">
                      <input type="number" value={row.cw || ''} placeholder="0" className="w-full text-center bg-transparent outline-none text-xs font-bold text-blue-700 placeholder:text-blue-200" onChange={(e) => updateRow(row.id, 'cw', e.target.value)} />
                    </td>
                    <td className="p-2 bg-blue-50/20 border-r border-blue-50 group-hover:bg-blue-50/40 transition-colors">
                      <input type="number" value={row.painting || ''} placeholder="0" className="w-full text-center bg-transparent outline-none text-xs font-bold text-blue-700 placeholder:text-blue-200" onChange={(e) => updateRow(row.id, 'painting', e.target.value)} />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deleteRow(row.id)}
                        className="text-slate-300 hover:text-red-500 transition-all p-2.5 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="py-12 border-t border-slate-200 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Workflow Protocol v4.0</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2025 AutoPro Dynamics Coimbatore</p>
              <p className="text-[9px] text-slate-300 font-medium">All estimates are subject to technical verification upon inspection.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;