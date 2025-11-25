import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  UploadCloud, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Download, 
  Cpu, 
  Brain,
  Menu,
  X
} from 'lucide-react';

/**
 * LungCancerAI Platform
 * A comprehensive frontend interface for the 3D MAE + MIL Lung Cancer Detection System.
 */

// --- Mock Data ---

const MOCK_PATIENTS = [
  { 
    id: 'PT-2024-089', 
    name: 'Eleanor Vance', 
    age: 64, 
    scanDate: '2024-05-14', 
    status: 'Analyzed', 
    risk: 'High', 
    stage: 'IIIA',
    analysis: {
      probabilities: { adenocarcinoma: 0.87, squamous: 0.10, benign: 0.03 },
      tnm: { t: 'T2a', n: 'N1', m: 'M0' },
      nodules: [
        { id: 1, location: 'RUL (Right Upper Lobe)', size: '24mm', confidence: 0.92, slice: 45 },
        { id: 2, location: 'RLL (Right Lower Lobe)', size: '8mm', confidence: 0.65, slice: 62 },
      ]
    }
  },
  { 
    id: 'PT-2024-092', 
    name: 'Hugh Crain', 
    age: 58, 
    scanDate: '2024-05-15', 
    status: 'Analyzed', 
    risk: 'Low', 
    stage: 'IA',
    analysis: {
      probabilities: { adenocarcinoma: 0.12, squamous: 0.05, benign: 0.83 },
      tnm: { t: 'T1b', n: 'N0', m: 'M0' },
      nodules: [
        { id: 1, location: 'LUL (Left Upper Lobe)', size: '6mm', confidence: 0.45, slice: 33 },
      ]
    }
  },
  { 
    id: 'PT-2024-095', 
    name: 'Arthur Montague', 
    age: 71, 
    scanDate: '2024-05-15', 
    status: 'Analyzed', 
    risk: 'Critical', 
    stage: 'IV',
    analysis: {
      probabilities: { adenocarcinoma: 0.10, squamous: 0.88, benign: 0.02 },
      tnm: { t: 'T4', n: 'N2', m: 'M1a' },
      nodules: [
        { id: 1, location: 'RUL (Right Upper Lobe)', size: '42mm', confidence: 0.98, slice: 55 },
        { id: 2, location: 'Mediastinal', size: '15mm', confidence: 0.95, slice: 48 },
        { id: 3, location: 'Pleural', size: '12mm', confidence: 0.91, slice: 70 },
      ]
    }
  },
  { 
    id: 'PT-2024-081', 
    name: 'Theodora C.', 
    age: 45, 
    scanDate: '2024-05-12', 
    status: 'Analyzed', 
    risk: 'Low', 
    stage: 'IA',
    analysis: {
      probabilities: { adenocarcinoma: 0.05, squamous: 0.01, benign: 0.94 },
      tnm: { t: 'T1a', n: 'N0', m: 'M0' },
      nodules: [
        { id: 1, location: 'RLL (Right Lower Lobe)', size: '4mm', confidence: 0.30, slice: 25 },
      ]
    }
  },
];

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'upload', label: 'New Analysis', icon: UploadCloud },
    { id: 'patients', label: 'Patient List', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">NeuroLung<span className="text-blue-500">AI</span></span>
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="mt-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 bg-slate-950">
        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-lg hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const Header = ({ title, user, setMobileOpen }) => (
  <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 sticky top-0 z-30">
    <div className="flex items-center">
      <button onClick={() => setMobileOpen(true)} className="mr-4 md:hidden text-slate-500">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
    </div>
    <div className="flex items-center space-x-4">
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search patient ID..." 
          className="pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>
      <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {user.initials}
        </div>
        <span className="text-sm font-medium text-slate-700 hidden md:block">{user.name}</span>
      </div>
    </div>
  </header>
);

// --- Core Views ---

const DashboardView = ({ onViewPatient }) => (
  <div className="p-6 space-y-6 animate-fadeIn">
    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: 'Cases Processed', value: '1,284', icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Avg. Accuracy', value: '94.2%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Critical Findings', value: '12', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'GPU Usage', value: '78%', icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-50' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
          <div className={`p-3 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>

    {/* Recent Patients Table */}
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Recent Scans</h3>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Patient ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Scan Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">AI Findings</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PATIENTS.map((pt) => (
              <tr key={pt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{pt.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{pt.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{pt.scanDate}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pt.status === 'Analyzed' ? 'bg-green-100 text-green-800' :
                    pt.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {pt.status === 'Processing' && <Activity className="w-3 h-3 mr-1 animate-pulse" />}
                    {pt.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {pt.stage !== '-' ? (
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">Stage {pt.stage}</span>
                      <span className="text-xs text-red-500">{pt.risk} Risk</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Waiting for AI...</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {pt.status === 'Analyzed' ? (
                    <button 
                      onClick={() => onViewPatient(pt)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group"
                    >
                      View Report <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : pt.status === 'Processing' ? (
                    <span className="text-slate-400 font-medium text-sm flex items-center cursor-not-allowed">
                       <Activity className="w-4 h-4 mr-2 animate-spin" /> Processing...
                    </span>
                  ) : (
                    <button className="text-slate-600 hover:text-blue-600 font-medium text-sm border border-slate-200 px-3 py-1 rounded hover:bg-slate-50 transition-colors">
                      Start Analysis
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const UploadView = ({ onUploadStart }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadStart(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm"
           onDragEnter={handleDrag}
           onDragLeave={handleDrag}
           onDragOver={handleDrag}
           onDrop={handleDrop}>
        
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <UploadCloud className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload DICOM Series</h2>
        <p className="text-slate-500 mb-8">Drag and drop your CT scan folder or .zip file here. <br/>Supports standard DICOM standards.</p>
        
        <button 
          onClick={() => inputRef.current.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
        >
          Select Files
        </button>
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          onChange={(e) => e.target.files[0] && onUploadStart(e.target.files[0])}
        />

        <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-slate-400">
          <div className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> HIPAA Compliant</div>
          <div className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> End-to-End Encrypted</div>
          <div className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Auto-Deidentification</div>
        </div>
      </div>
    </div>
  );
};

const ProcessingView = ({ progress, onComplete }) => {
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(onComplete, 800);
    }
  }, [progress, onComplete]);

  const steps = [
    { threshold: 10, label: 'Uploading to S3 Bucket...' },
    { threshold: 30, label: 'Preprocessing (Normalization & Resampling)...' },
    { threshold: 50, label: '3D MAE Feature Extraction...' },
    { threshold: 75, label: 'Running Multiple Instance Learning (MIL)...' },
    { threshold: 90, label: 'Generating Grad-CAM & Radiomics Report...' },
    { threshold: 100, label: 'Analysis Complete.' },
  ];

  const currentStep = steps.find(s => progress <= s.threshold)?.label || 'Finalizing...';

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#2563eb" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} strokeLinecap="round" className="transition-all duration-500 ease-out transform -rotate-90 origin-center" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-800">
            {progress}%
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Analyzing CT Scan</h3>
        <p className="text-sm text-slate-500 mb-6 h-6 animate-pulse">{currentStep}</p>
        
        <div className="text-left space-y-3 text-xs text-slate-400 border-t pt-4 border-slate-100">
          <div className="flex justify-between"><span>Pipeline Status:</span> <span className="text-blue-500 font-medium">Active</span></div>
          <div className="flex justify-between"><span>Model Version:</span> <span>v2.4.1 (MAE-ViT-L)</span></div>
        </div>
      </div>
    </div>
  );
};

// The Complex Viewer Component
const AnalysisWorkstation = ({ patient, onBack }) => {
  const [slice, setSlice] = useState(50);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMask, setShowMask] = useState(false);
  const canvasRef = useRef(null);
  
  // Safe access to analysis data with fallback
  const results = patient.analysis || {
    probabilities: { adenocarcinoma: 0, squamous: 0, benign: 0 },
    tnm: { t: '-', n: '-', m: '-' },
    nodules: []
  };

  // Report download handler
  const handleDownload = () => {
    const reportContent = `NEUROLUNG AI - CLINICAL REPORT
------------------------------------------------------------
PATIENT DETAILS
ID: ${patient.id}
Name: ${patient.name}
Scan Date: ${patient.scanDate}
Analysis Date: ${new Date().toLocaleDateString()}

DIAGNOSTIC SUMMARY
------------------------------------------------------------
Predicted Stage: ${patient.stage}
Risk Assessment: ${patient.risk}

TNM CLASSIFICATION
Tumor (T): ${results.tnm.t}
Node (N):  ${results.tnm.n}
Metastasis (M): ${results.tnm.m}

AI PROBABILITY ANALYSIS
Adenocarcinoma: ${(results.probabilities.adenocarcinoma * 100).toFixed(1)}%
Squamous Cell Carcinoma: ${(results.probabilities.squamous * 100).toFixed(1)}%
Benign/Non-Malignant: ${(results.probabilities.benign * 100).toFixed(1)}%

DETECTED NODULES
------------------------------------------------------------
${results.nodules.map((n, i) => `
Nodule #${i + 1}
  Location:   ${n.location}
  Size:       ${n.size}
  Slice Ref:  #${n.slice}
  Confidence: ${(n.confidence * 100).toFixed(1)}%
`).join('')}
------------------------------------------------------------
CONFIDENTIAL: This report was generated by an AI Diagnostic Support System.
Clinical correlation is required.
`;

    // Create a blob and trigger download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${patient.id}_Report.txt`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  // Draw the "CT Scan"
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Simulate lung shape changes based on slice
    const scale = 1 + Math.sin(slice * 0.05) * 0.1; 
    
    // Draw Left Lung
    ctx.beginPath();
    ctx.fillStyle = '#1a1a1a'; // Dark gray lung tissue
    ctx.ellipse(centerX - 80, centerY, 60 * scale, 100 * scale, 0.1, 0, 2 * Math.PI);
    ctx.fill();

    // Draw Right Lung
    ctx.beginPath();
    ctx.ellipse(centerX + 80, centerY, 60 * scale, 100 * scale, -0.1, 0, 2 * Math.PI);
    ctx.fill();

    // Draw Nodule (simulated at specific slices)
    // We'll use the first nodule to visualize
    const mainNodule = results.nodules[0];

    if (mainNodule && slice > (mainNodule.slice - 15) && slice < (mainNodule.slice + 15)) {
      const noduleOpacity = 1 - Math.abs(mainNodule.slice - slice) / 15; // Fade in/out
      
      // The Nodule
      ctx.beginPath();
      ctx.fillStyle = `rgba(200, 200, 200, ${noduleOpacity})`;
      // Simple check to put nodule on left or right based on description
      const xOffset = mainNodule.location.includes('Left') ? 60 : -60;
      ctx.arc(centerX + xOffset, centerY - 30, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Grad-CAM Heatmap Overlay
      if (showHeatmap) {
        // Create radial gradient for heatmap
        const gradient = ctx.createRadialGradient(centerX + xOffset, centerY - 30, 2, centerX + xOffset, centerY - 30, 40);
        gradient.addColorStop(0, `rgba(255, 0, 0, ${noduleOpacity * 0.8})`); // Red center
        gradient.addColorStop(0.5, `rgba(255, 165, 0, ${noduleOpacity * 0.5})`); // Orange mid
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent edge
        
        ctx.fillStyle = gradient;
        ctx.fillRect(centerX + xOffset - 60, centerY - 90, 120, 120);
      }
    }
    
    // Scan Info Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`Slice: ${slice}/100`, 20, 30);
    ctx.fillText(`Pos: ${(slice * 1.5).toFixed(1)}mm`, 20, 50);
    ctx.fillText(`WL: -500 WW: 1500`, 20, canvas.height - 20);

  }, [slice, showHeatmap, showMask, results]);

  return (
    <div className="flex flex-col h-full animate-fadeIn bg-slate-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium">
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{patient.name}</h2>
            <p className="text-xs text-slate-500">ID: {patient.id} • {patient.scanDate}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <button 
             onClick={handleDownload}
             className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-900"
            >
             <Download className="w-4 h-4 mr-2" /> PDF Report
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Viewer (Left) */}
        <div className="flex-1 bg-black relative flex flex-col">
           <div className="absolute top-4 right-4 z-10 flex space-x-2">
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold backdrop-blur-md flex items-center ${showHeatmap ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-white/10 text-slate-300 border border-white/10'}`}
              >
                <Eye className="w-3 h-3 mr-1.5" /> Grad-CAM
              </button>
              <button 
                onClick={() => setShowMask(!showMask)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold backdrop-blur-md border border-white/10 ${showMask ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-slate-300'}`}
              >
                Segmentation
              </button>
           </div>

           <div className="flex-1 flex items-center justify-center p-4">
              <canvas 
                ref={canvasRef} 
                width={512} 
                height={512} 
                className="max-w-full max-h-full border border-slate-800 shadow-2xl"
              />
           </div>
           
           {/* Slider Controls */}
           <div className="h-16 bg-slate-900 border-t border-slate-800 flex items-center px-6">
             <span className="text-slate-400 text-xs w-12">Inferior</span>
             <input 
               type="range" 
               min="1" 
               max="100" 
               value={slice} 
               onChange={(e) => setSlice(parseInt(e.target.value))}
               className="flex-1 mx-4 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
             />
             <span className="text-slate-400 text-xs w-12 text-right">Superior</span>
           </div>
        </div>

        {/* AI Findings Sidebar (Right) */}
        <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" /> AI Findings
            </h3>

            {/* TNM Staging Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-600">Predicted Stage</span>
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">High Confidence</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">Stage {patient.stage}</div>
              <div className="flex space-x-2 text-xs">
                <span className="bg-white border px-2 py-1 rounded font-mono">{results.tnm.t}</span>
                <span className="bg-white border px-2 py-1 rounded font-mono">{results.tnm.n}</span>
                <span className="bg-white border px-2 py-1 rounded font-mono">{results.tnm.m}</span>
              </div>
            </div>

            {/* Probabilities */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Histology Probability</h4>
              <div className="space-y-3">
                {[
                  { label: 'Adenocarcinoma', val: results.probabilities.adenocarcinoma, col: 'bg-red-500' },
                  { label: 'Squamous Cell', val: results.probabilities.squamous, col: 'bg-orange-400' },
                  { label: 'Benign', val: results.probabilities.benign, col: 'bg-green-500' },
                ].map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">{p.label}</span>
                      <span className="font-medium">{(p.val * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${p.col}`} style={{ width: `${p.val * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nodule List */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Detected Nodules</h4>
              <div className="space-y-3">
                {results.nodules.map((nodule) => (
                  <button 
                    key={nodule.id} 
                    onClick={() => setSlice(nodule.slice)}
                    className="w-full text-left bg-white border border-slate-200 p-3 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800 text-sm">Nodule #{nodule.id}</span>
                      <span className="text-xs text-blue-600 group-hover:underline">Go to Slice {nodule.slice}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between">
                      <span>{nodule.location}</span>
                      <span>Size: {nodule.size}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Logic ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePatient, setActivePatient] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mock User - Generic AI Platform Profile
  const user = { name: 'NeuroLung AI', initials: 'AI', role: 'System' };

  const handleUploadStart = (file) => {
    // Simulate upload/process loop
    setActiveTab('processing');
    setIsProcessing(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (prev < 50 ? 5 : 2); // Fast start, slow finish simulation
      });
    }, 200);
  };

  const handleAnalysisComplete = () => {
    setIsProcessing(false);
    setUploadProgress(0);
    
    // --- RANDOMIZED DATA GENERATION FOR DEMO PURPOSES ---
    const rand = Math.random();
    const isCancer = rand > 0.3; // 70% chance of cancer for demo
    const isBenign = !isCancer;

    const randomSlice = Math.floor(Math.random() * 50) + 25; // Random slice between 25 and 75
    const randomId = Math.floor(Math.random() * 10000);

    const newPatient = { 
      id: `PT-2025-${randomId}`, 
      name: `Analyzed Case #${randomId}`, 
      age: Math.floor(Math.random() * 40) + 40, 
      scanDate: new Date().toISOString().split('T')[0],
      status: 'Analyzed', 
      risk: isCancer ? (rand > 0.7 ? 'Critical' : 'High') : 'Low', 
      stage: isBenign ? 'IA' : (rand > 0.7 ? 'IV' : 'IIIA'),
      analysis: {
        probabilities: isBenign ? 
          { adenocarcinoma: 0.02, squamous: 0.01, benign: 0.97 } :
          { adenocarcinoma: (Math.random() * 0.4 + 0.5), squamous: (Math.random() * 0.2), benign: 0.05 },
        tnm: isBenign ? 
          { t: 'T1a', n: 'N0', m: 'M0' } : 
          { t: rand > 0.7 ? 'T4' : 'T2a', n: rand > 0.7 ? 'N2' : 'N1', m: rand > 0.7 ? 'M1' : 'M0' },
        nodules: [
          { 
            id: 1, 
            location: Math.random() > 0.5 ? 'RUL (Right Upper)' : 'LUL (Left Upper)', 
            size: isBenign ? '4mm' : (Math.floor(Math.random() * 30) + 10) + 'mm', 
            confidence: 0.94, 
            slice: randomSlice 
          }
        ]
      }
    };

    setActivePatient(newPatient);
    setActiveTab('viewer');
  };

  const handleViewPatient = (patient) => {
    setActivePatient(patient);
    setActiveTab('viewer');
  };

  // Render Logic
  const renderContent = () => {
    if (activeTab === 'viewer' && activePatient) {
      return <AnalysisWorkstation patient={activePatient} onBack={() => setActiveTab('dashboard')} />;
    }

    if (activeTab === 'processing') {
      return <ProcessingView progress={uploadProgress} onComplete={handleAnalysisComplete} />;
    }

    // Default container for standard pages
    return (
      <div className="flex-1 overflow-auto bg-slate-50">
        <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} user={user} setMobileOpen={setMobileOpen} />
        <main className="max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardView onViewPatient={handleViewPatient} />}
          {activeTab === 'upload' && <UploadView onUploadStart={handleUploadStart} />}
          {activeTab === 'patients' && <DashboardView onViewPatient={handleViewPatient} />} {/* Reusing for demo */}
          {activeTab === 'reports' && (
            <div className="p-8 text-center text-slate-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium">Generated Reports Archive</h3>
              <p>Searchable archive of all PDF reports generated by the system.</p>
            </div>
          )}
          {activeTab === 'settings' && (
             <div className="p-8 max-w-2xl">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Model Configuration</h3>
                <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">3D MAE Pretraining</p>
                      <p className="text-sm text-slate-500">Enable self-supervised learning weights</p>
                    </div>
                    <div className="w-11 h-6 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                    <div>
                      <p className="font-medium text-slate-900">Uncertainty Calibration</p>
                      <p className="text-sm text-slate-500">Monte Carlo Dropout (N=50)</p>
                    </div>
                    <div className="w-11 h-6 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                  </div>
                </div>
             </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 md:pl-64 transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
}
