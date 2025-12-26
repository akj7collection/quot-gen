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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

interface ModernInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  fullWidth?: boolean;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ModernInput: React.FC<ModernInputProps> = ({
  label, name, type = "text", placeholder, value, fullWidth = false, inputMode, onChange
}) => (
  <div className={`group relative ${fullWidth ? 'col-span-full' : ''}`}>
    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      inputMode={inputMode}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300 hover:border-slate-300"
    />
  </div>
);

// --- Professional PDF Template ---
interface PDFTemplateProps {
  formData: WorkshopFormData;
  rows: ServiceRow[];
  totals: Totals;
}

const PDFTemplate: React.FC<PDFTemplateProps> = ({ formData, rows, totals }) => (
  <div className="pdf-container">
    <div className="pdf-header flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 overflow-hidden">
          <img src={jkmLogo} alt="JK Motors" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-800 uppercase">JK MOTORS</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Multi-Brand Premium Workshop</p>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[250px]">
            No. 12, Sathy Main Road, Coimbatore - 641035<br />
            GSTIN: 33XXXXXXXXXXXXX | Phone: +91 98XXX XXXXX
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-black text-blue-600 uppercase mb-1">{formData.docType}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date: {formData.date}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref: {formData.quotationNo}</div>
      </div>
    </div>

    <div className="pdf-grid">
      <div>
        <div className="pdf-section-title">Client Details</div>
        <div className="space-y-1">
          <div><span className="pdf-label">Name:</span> <span className="pdf-value">{formData.name || 'N/A'}</span></div>
          <div><span className="pdf-label">Phone:</span> <span className="pdf-value">{formData.phone || 'N/A'}</span></div>
          <div><span className="pdf-label">Address:</span> <span className="pdf-value">{formData.address || 'N/A'}</span></div>
        </div>
      </div>
      <div>
        <div className="pdf-section-title">Vehicle Information</div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <div><span className="pdf-label">Reg. No:</span> <span className="pdf-value">{formData.vehicleNo || 'N/A'}</span></div>
            <div><span className="pdf-label">Year:</span> <span className="pdf-value">{formData.year || 'N/A'}</span></div>
          </div>
          <div className="flex justify-between">
            <div><span className="pdf-label">Make:</span> <span className="pdf-value">{formData.make || 'N/A'}</span></div>
            <div><span className="pdf-label">Model:</span> <span className="pdf-value">{formData.model || 'N/A'}</span></div>
          </div>
          <div className="flex justify-between">
            <div><span className="pdf-label">Odometer:</span> <span className="pdf-value">{formData.odometer ? `${formData.odometer} km` : 'N/A'}</span></div>
            <div><span className="pdf-label">Insurance:</span> <span className="pdf-value">{formData.insuranceCo || 'N/A'}</span></div>
          </div>
        </div>
      </div>
    </div>

    <div className="pdf-section-title">Service & Parts Breakdown</div>
    <table className="pdf-table">
      <thead>
        <tr>
          <th className="w-10 text-center">#</th>
          <th>Description</th>
          <th className="w-16 text-center">Qty</th>
          <th className="w-24 text-right">Spares</th>
          <th className="w-20 text-center">Labor</th>
        </tr>
      </thead>
      <tbody>
        {rows.filter(r => r.description.trim() !== '').map((row, idx) => {
          const rowLabor = (row.rr || 0) + (row.dr || 0) + (row.cw || 0) + (row.painting || 0);
          return (
            <tr key={row.id}>
              <td className="text-center text-slate-400">{idx + 1}</td>
              <td className="font-medium">{row.description}</td>
              <td className="text-center">{row.quantity}</td>
              <td className="text-right">₹{((row.spares || 0) * row.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              <td className="text-center">₹{(rowLabor).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr className="pdf-total-row">
          <td colSpan={3} className="text-right py-3 pr-4">Sub-Totals</td>
          <td className="text-right py-3 px-2">₹{totals.spares.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td className="text-center py-3 px-2">₹{totals.labor.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr className="bg-blue-600 text-white">
          <td colSpan={3} className="text-right py-4 pr-4 font-black uppercase tracking-widest text-xs">Grand Total Payable</td>
          <td colSpan={2} className="text-right py-4 pr-6 text-xl font-black">₹{totals.grand.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      </tfoot>
    </table>

    <div className="mt-12 mb-20 text-[10px] text-slate-500 font-medium italic">
      <p>Terms & Conditions:</p>
      <ul className="list-disc ml-5 mt-1 space-y-0.5">
        <li>This estimation is valid for 7 days from the date of issue.</li>
        <li>Final billing will be based on actual parts consumed and labor performed.</li>
        <li>Vehicle will be delivered only after full payment of the invoice amount.</li>
      </ul>
    </div>

    <div className="flex justify-between mt-20 pt-10 border-t border-slate-100">
      <div className="pdf-signature-box">
        Customer Signature
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase text-slate-800">For JK MOTORS</p>
        <div className="h-16"></div>
        <div className="pdf-signature-box">
          Authorized Signatory
        </div>
      </div>
    </div>
  </div>
);


const App: React.FC = () => {
  // --- State Management ---
  const [formData, setFormData] = useState<WorkshopFormData>({
    docType: 'Quotation',
    name: '',
    address: '',
    quotationNo: Math.floor(1000 + Math.random() * 9000).toString(),
    date: new Date().toISOString().split('T')[0],
    vehicleNo: '',
    make: '',
    model: '',
    year: '',
    odometer: '',
    phone: '+91 ',
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
  const [isTableOpen, setIsTableOpen] = useState(true);

  const pdfRef = React.useRef<HTMLDivElement>(null);


  // --- Handlers ---
  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      // Ensure totals are fresh
      calculateTotals();

      // Reset scroll position
      window.scrollTo(0, 0);

      // Add a temporary class for PDF generation (still useful for general cleanup)
      document.body.classList.add('is-generating-pdf');

      const element = pdfRef.current;
      // Temporarily move template into view-port but keep it off-screen for capture
      // html2canvas needs the element to be in the DOM and have a layout (not display: none)
      element.style.position = 'fixed';
      element.style.top = '0';
      element.style.left = '0';
      element.style.visibility = 'visible';
      element.style.zIndex = '99999';
      element.style.width = '210mm'; // A4 Width
      element.style.background = 'white';

      // Wait for layout and image loading
      await new Promise(resolve => setTimeout(resolve, 600));


      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution but safer for memory
        useCORS: true,
        allowTaint: false, // Prevents "tainted" canvas which causes UNKNOWN image type errors
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Hide template again
      element.style.display = 'none';

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Verification: Ensure we have a valid data URL
      if (!imgData.startsWith('data:image')) {
        throw new Error('Invalid image data generated');
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);

      const fileName = `${formData.docType}_${formData.vehicleNo || 'Document'}_${formData.date}.pdf`;
      pdf.save(fileName);

    } catch (error: any) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      document.body.classList.remove('is-generating-pdf');
      if (pdfRef.current) {
        pdfRef.current.style.visibility = 'hidden';
      }
    }
  };




  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let validatedValue = value;

    // Strict validation logic
    switch (name) {
      case 'name':
      case 'estimatedBy':
        // Alpha + space/dot
        if (!/^[a-zA-Z\s.]*$/.test(value)) return;
        break;
      case 'address':
        // AlphaNumeric + Special chars (.,#/-)
        if (!/^[a-zA-Z0-9\s.,#/-]*$/.test(value)) return;
        break;
      case 'vehicleNo':
        // AlphaNumeric
        if (!/^[a-zA-Z0-9\s]*$/.test(value)) return;
        validatedValue = value.toUpperCase(); // Force uppercase for vehicle numbers
        break;
      case 'quotationNo':
      case 'year':
        // Numbers only
        if (!/^\d*$/.test(value)) return;
        break;
      case 'phone':
        // Strip everything except digits
        const rawDigits = value.replace(/^\+91\s?/, '').replace(/\D/g, '').slice(0, 10);

        let formattedPhone = '+91 ';
        if (rawDigits.length > 0) {
          const part1 = rawDigits.slice(0, 3);
          const part2 = rawDigits.slice(3, 6);
          const part3 = rawDigits.slice(6, 10);

          formattedPhone += part1;
          if (part2) formattedPhone += ' ' + part2;
          if (part3) formattedPhone += ' ' + part3;
        }
        validatedValue = formattedPhone;
        break;
      case 'odometer':
        // Strip non-digits to get raw value
        const rawOdo = value.replace(/\D/g, '');
        if (rawOdo === '') {
          validatedValue = '';
        } else {
          // Format with Indian numbering system
          validatedValue = Number(rawOdo).toLocaleString('en-IN');
        }
        break;
      case 'make':
      case 'insuranceCo':
        // Alpha + space
        if (!/^[a-zA-Z\s]*$/.test(value)) return;
        break;
      case 'model':
        // General string, but let's prevent some special chars
        if (/[<>{}[]]/.test(value)) return;
        break;
    }

    setFormData(prev => ({ ...prev, [name]: validatedValue }));
  };

  const updateRow = (id: number, field: keyof ServiceRow, value: string | number) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        if (field === 'description') {
          return { ...row, [field]: value.toString() };
        }
        // For numeric fields, strip commas and parse
        const stringVal = value.toString().replace(/,/g, '');
        const numericVal = parseFloat(stringVal) || 0;
        return { ...row, [field]: numericVal };
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

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-700">

      {/* Hidden Professional PDF Template - Fixed at bottom of page far to the left */}
      <div
        ref={pdfRef}
        style={{
          position: 'absolute',
          left: '-10000px',
          top: '0',
          visibility: 'hidden',
          backgroundColor: 'white'
        }}
      >
        <PDFTemplate formData={formData} rows={rows} totals={totals} />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 bg-slate-100 p-4 rounded-3xl">


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
            <button
              className="p-2.5 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-600 border border-slate-200"
              data-pdf-ignore
            >
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
                <ModernInput label="Date" type="date" name="date" value={formData.date} onChange={handleInputChange} />
                <ModernInput label="Reference No." name="quotationNo" value={formData.quotationNo} inputMode="numeric" onChange={handleInputChange} />
                <ModernInput label="Advisor / Estimator" name="estimatedBy" value={formData.estimatedBy} placeholder="e.g. Mike Ross" onChange={handleInputChange} />
                <ModernInput label="Customer Name" name="name" value={formData.name} placeholder="Client Full Name" onChange={handleInputChange} />
                <ModernInput label="Contact Number" name="phone" value={formData.phone} placeholder="+91 00000 00000" inputMode="tel" onChange={handleInputChange} />
                <ModernInput label="Billing Address" name="address" value={formData.address} placeholder="Full Street Address" fullWidth onChange={handleInputChange} />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100">
              <SectionHeader title="Vehicle Profile" icon={Car} colorClass="text-emerald-600 bg-emerald-50" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <ModernInput label="Vehicle Reg. No." name="vehicleNo" value={formData.vehicleNo} placeholder="AB 01 CD 1234" onChange={handleInputChange} />
                <ModernInput label="Odometer (km)" name="odometer" value={formData.odometer} placeholder="00,000" inputMode="numeric" onChange={handleInputChange} />
                <ModernInput label="Model Year" name="year" value={formData.year} placeholder="YYYY" inputMode="numeric" onChange={handleInputChange} />
                <ModernInput label="Make / Brand" name="make" value={formData.make} placeholder="e.g. Toyota" onChange={handleInputChange} />
                <ModernInput label="Model Variant" name="model" value={formData.model} placeholder="e.g. Fortuner 4x4" onChange={handleInputChange} />
                <ModernInput label="Insurance Co." name="insuranceCo" value={formData.insuranceCo} placeholder="Provider Name" onChange={handleInputChange} />
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

                  <button
                    onClick={handleDownloadPDF}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-slate-700"
                  >
                    <Printer size={18} /> Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Table Section - Accordion Style */}
        <section className={`bg-white rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden mt-6 transition-all duration-300 ${isTableOpen ? 'max-h-[2000px]' : 'max-h-[88px]'}`}>
          <div
            onClick={() => setIsTableOpen(!isTableOpen)}
            className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Parts & Labor Breakdown</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scenario 1: Standard Estimation</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={(e) => { e.stopPropagation(); addRow(); }}
                data-pdf-ignore
                className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all text-[11px] font-black uppercase tracking-widest shadow-sm active:scale-95"
              >
                <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Add Line Item
              </button>

              <div className={`text-slate-400 transition-transform duration-300 ${isTableOpen ? 'rotate-180' : ''}`} data-pdf-ignore>
                <ChevronDown size={20} />
              </div>
            </div>
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
                  <th className="py-4 px-4 w-12" data-pdf-ignore></th>
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
                        type="text"
                        inputMode="numeric"
                        value={row.spares ? row.spares.toLocaleString('en-IN') : ''}
                        placeholder="0.00"
                        className="w-full text-right bg-slate-50/50 px-4 py-3 rounded-xl outline-none text-sm font-mono font-bold text-emerald-600 placeholder:text-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-100 border border-transparent focus:border-emerald-200 transition-all"
                        onChange={(e) => updateRow(row.id, 'spares', e.target.value)}
                      />
                    </td>
                    {/* Labor Group Inputs */}
                    <td className="p-2 bg-blue-50/20 border-l border-blue-50 group-hover:bg-blue-50/40 transition-colors">
                      <input type="text" inputMode="numeric" value={row.rr ? row.rr.toLocaleString('en-IN') : ''} placeholder="0" className="w-full text-center bg-transparent outline-none text-xs font-bold text-blue-700 placeholder:text-blue-200" onChange={(e) => updateRow(row.id, 'rr', e.target.value)} />
                    </td>
                    <td className="p-2 bg-blue-50/20 group-hover:bg-blue-50/40 transition-colors">
                      <input type="text" inputMode="numeric" value={row.dr ? row.dr.toLocaleString('en-IN') : ''} placeholder="0" className="w-full text-center bg-transparent outline-none text-xs font-bold text-blue-700 placeholder:text-blue-200" onChange={(e) => updateRow(row.id, 'dr', e.target.value)} />
                    </td>
                    <td className="p-2 bg-blue-50/20 group-hover:bg-blue-50/40 transition-colors">
                      <input type="text" inputMode="numeric" value={row.cw ? row.cw.toLocaleString('en-IN') : ''} placeholder="0" className="w-full text-center bg-transparent outline-none text-xs font-bold text-blue-700 placeholder:text-blue-200" onChange={(e) => updateRow(row.id, 'cw', e.target.value)} />
                    </td>
                    <td className="p-2 bg-blue-50/20 border-r border-blue-50 group-hover:bg-blue-50/40 transition-colors">
                      <input type="text" inputMode="numeric" value={row.painting ? row.painting.toLocaleString('en-IN') : ''} placeholder="0" className="w-full text-center bg-transparent outline-none text-xs font-bold text-blue-700 placeholder:text-blue-200" onChange={(e) => updateRow(row.id, 'painting', e.target.value)} />
                    </td>
                    <td className="p-2 text-center" data-pdf-ignore>
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