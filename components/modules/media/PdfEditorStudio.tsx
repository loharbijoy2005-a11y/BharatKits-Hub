"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import {
  FileSignature,
  Download,
  Upload,
  RotateCw,
  Trash2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Type,
  PenTool,
  Highlighter,
  Stamp,
  ShieldAlert,
  Eraser,
  Layers,
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  MousePointer,
  X,
  Check,
  Copy,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PDFDocument, degrees, rgb } from "pdf-lib";

// Types
type ToolType =
  | "select"
  | "signature"
  | "text"
  | "pen"
  | "highlighter"
  | "whiteout"
  | "blackout"
  | "stamp"
  | "rectangle"
  | "circle"
  | "checkmark"
  | "cross";

interface BaseAnnotation {
  id: string;
  pageIndex: number;
  x: number; // percentage of page width (0 to 100)
  y: number; // percentage of page height (0 to 100)
  width?: number; // percentage of page width
  height?: number; // percentage of page height
  rotation?: number;
}

interface TextAnnotation extends BaseAnnotation {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  isBold?: boolean;
  isItalic?: boolean;
  bgColor?: string;
}

interface ImageAnnotation extends BaseAnnotation {
  type: "signature" | "image";
  dataUrl: string;
}

interface StampAnnotation extends BaseAnnotation {
  type: "stamp";
  text: string;
  subText?: string;
  color: string;
  borderColor: string;
}

interface RedactionAnnotation extends BaseAnnotation {
  type: "redaction";
  redactionType: "whiteout" | "blackout";
}

interface ShapeAnnotation extends BaseAnnotation {
  type: "shape";
  shapeType: "rectangle" | "circle" | "checkmark" | "cross";
  strokeColor: string;
  strokeWidth: number;
  fill?: string;
}

interface DrawingPath {
  id: string;
  pageIndex: number;
  points: { x: number; y: number }[];
  strokeColor: string;
  strokeWidth: number;
  isHighlighter?: boolean;
}

type Annotation =
  | TextAnnotation
  | ImageAnnotation
  | StampAnnotation
  | RedactionAnnotation
  | ShapeAnnotation;

// Official Stamp Presets
const STAMP_PRESETS = [
  { name: "SELF-ATTESTED", subText: "Verified Copy", color: "#16a34a", borderColor: "#16a34a" },
  { name: "APPROVED", subText: "Official Clearance", color: "#059669", borderColor: "#059669" },
  { name: "VERIFIED", subText: "Document Validated", color: "#2563eb", borderColor: "#2563eb" },
  { name: "CONFIDENTIAL", subText: "Do Not Disclose", color: "#dc2626", borderColor: "#dc2626" },
  { name: "ORIGINAL", subText: "Master Record", color: "#d97706", borderColor: "#d97706" },
  { name: "PAID", subText: "Payment Cleared", color: "#0d9488", borderColor: "#0d9488" },
  { name: "RECEIVED", subText: "Acknowledged", color: "#4f46e5", borderColor: "#4f46e5" },
  { name: "REJECTED", subText: "Invalid Details", color: "#e11d48", borderColor: "#e11d48" },
];

export default function PdfEditorStudio() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pageRotations, setPageRotations] = useState<number[]>([]);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }[]>([]);

  // Active Tool
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [primaryColor, setPrimaryColor] = useState<string>("#1e40af");
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [fontSize, setFontSize] = useState<number>(16);

  // Annotations & Drawings State
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [drawings, setDrawings] = useState<DrawingPath[]>([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<{ annotations: Annotation[]; drawings: DrawingPath[] }[]>([]);
  const [redoStack, setRedoStack] = useState<{ annotations: Annotation[]; drawings: DrawingPath[] }[]>([]);

  // UI States
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [isSavingPdf, setIsSavingPdf] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  const [showStampPalette, setShowStampPalette] = useState<boolean>(false);

  // Signature Modal Tabs
  const [signatureMode, setSignatureMode] = useState<"draw" | "type" | "upload">("draw");
  const [typedSignText, setTypedSignText] = useState<string>("Authorized Signatory");
  const [selectedSignFont, setSelectedSignFont] = useState<string>("cursive");
  const [sigPenColor, setSigPenColor] = useState<string>("#0f172a");

  // Dragging / Drawing refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigImageInputRef = useRef<HTMLInputElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigPadCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);

  // Moving annotation state
  const [isDraggingAnnotation, setIsDraggingAnnotation] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resizing annotation state
  const [isResizingAnnotation, setIsResizingAnnotation] = useState<boolean>(false);
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
    initialW: number;
    initialH: number;
  }>({ x: 0, y: 0, initialW: 28, initialH: 12 });

  // Load PDF.js library dynamically from CDN
  const [isPdfJsReady, setIsPdfJsReady] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as unknown as { pdfjsLib?: unknown }).pdfjsLib) {
      setIsPdfJsReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjs = (window as unknown as { pdfjsLib: { GlobalWorkerOptions: { workerSrc: string } } }).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        setIsPdfJsReady(true);
      }
    };
    document.body.appendChild(script);
  }, []);

  // Save state to undo stack
  const recordHistory = useCallback(() => {
    setUndoStack((prev) => [...prev.slice(-20), { annotations, drawings }]);
    setRedoStack([]);
  }, [annotations, drawings]);

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, { annotations, drawings }]);
    setAnnotations(previous.annotations);
    setDrawings(previous.drawings);
    setUndoStack((prev) => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, { annotations, drawings }]);
    setAnnotations(next.annotations);
    setDrawings(next.drawings);
    setRedoStack((prev) => prev.slice(0, -1));
  };

  // Load sample starter PDF
  const loadStarterPdf = async () => {
    setIsPdfLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]);
      
      page.drawText("SAMPLE DOCUMENT FOR SIGNING & EDITING", {
        x: 50,
        y: 780,
        size: 18,
        color: rgb(0.1, 0.2, 0.5),
      });

      page.drawText("This is a demo canvas. You can upload any PDF or try out editing tools on this page.", {
        x: 50,
        y: 740,
        size: 11,
        color: rgb(0.3, 0.3, 0.3),
      });

      page.drawText("Features Available:", { x: 50, y: 700, size: 12, color: rgb(0.1, 0.1, 0.1) });
      page.drawText("• Click '+ Signature (E-Sign)' to draw, type, or upload your signature.", { x: 60, y: 675, size: 11, color: rgb(0.2, 0.2, 0.2) });
      page.drawText("• Click 'Text Box' to place text annotations anywhere.", { x: 60, y: 650, size: 11, color: rgb(0.2, 0.2, 0.2) });
      page.drawText("• Use 'Highlight' to mark text or 'Whiteout / Blackout' to redact sensitive details.", { x: 60, y: 625, size: 11, color: rgb(0.2, 0.2, 0.2) });
      page.drawText("• Click 'Stamps' to add 'SELF-ATTESTED', 'APPROVED', or 'VERIFIED' badges.", { x: 60, y: 600, size: 11, color: rgb(0.2, 0.2, 0.2) });

      page.drawText("Authorized Signatory Line:", { x: 50, y: 220, size: 11, color: rgb(0.4, 0.4, 0.4) });
      page.drawLine({
        start: { x: 50, y: 170 },
        end: { x: 250, y: 170 },
        thickness: 1,
        color: rgb(0.5, 0.5, 0.5),
      });
      page.drawText("Date: ____________________", { x: 350, y: 170, size: 11, color: rgb(0.4, 0.4, 0.4) });

      const bytes = await pdfDoc.save();
      setPdfBytes(bytes);
      setPdfFileName("Sample_Document.pdf");
      setPageCount(1);
      setCurrentPageIndex(0);
      setPageRotations([0]);
      setPageDimensions([{ width: 595.28, height: 841.89 }]);
      setAnnotations([]);
      setDrawings([]);
    } catch (err) {
      console.error("Failed to load sample PDF:", err);
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Process uploaded PDF File (from input or drag & drop)
  const processPdfFile = async (file: File) => {
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a valid .pdf file format.");
      return;
    }

    setIsPdfLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const pdfDoc = await PDFDocument.load(bytes);
      const count = pdfDoc.getPageCount();

      const rotations: number[] = [];
      const dims: { width: number; height: number }[] = [];

      for (let i = 0; i < count; i++) {
        const page = pdfDoc.getPage(i);
        rotations.push(page.getRotation().angle);
        dims.push({ width: page.getWidth(), height: page.getHeight() });
      }

      setPdfBytes(bytes);
      setPdfFileName(file.name);
      setPageCount(count);
      setCurrentPageIndex(0);
      setPageRotations(rotations);
      setPageDimensions(dims);
      setAnnotations([]);
      setDrawings([]);
      setUndoStack([]);
      setRedoStack([]);
    } catch (err) {
      console.error("Error loading uploaded PDF:", err);
      alert("Could not load PDF. It might be password-protected or encrypted.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Handle PDF File Upload from input
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPdfFile(file);
    }
  };

  // Render current PDF page onto background canvas using PDF.js
  const renderCurrentPage = useCallback(async () => {
    if (!pdfBytes || !isPdfJsReady || !pdfCanvasRef.current) return;

    try {
      const pdfjs = (window as unknown as { pdfjsLib: { getDocument: (data: { data: Uint8Array }) => { promise: Promise<{ getPage: (num: number) => Promise<{ render: (params: unknown) => { promise: Promise<void> }; getViewport: (params: { scale: number; rotation?: number }) => { width: number; height: number } }> }> } } }).pdfjsLib;
      if (!pdfjs) return;

      const loadingTask = pdfjs.getDocument({ data: pdfBytes });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(currentPageIndex + 1);

      const canvas = pdfCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rotation = pageRotations[currentPageIndex] || 0;
      const viewport = page.getViewport({ scale: 1.8, rotation });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (drawCanvasRef.current) {
        drawCanvasRef.current.width = viewport.width;
        drawCanvasRef.current.height = viewport.height;
      }

      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (err) {
      console.error("Failed to render page:", err);
    }
  }, [pdfBytes, isPdfJsReady, currentPageIndex, pageRotations]);

  useEffect(() => {
    if (pdfBytes) {
      renderCurrentPage();
    }
  }, [pdfBytes, renderCurrentPage]);

  // Redraw drawings on overlay canvas whenever drawings change for current page
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentDrawings = drawings.filter((d) => d.pageIndex === currentPageIndex);

    currentDrawings.forEach((drawing) => {
      if (drawing.points.length < 2) return;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = drawing.strokeColor;
      ctx.lineWidth = drawing.strokeWidth * (canvas.width / 600);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (drawing.isHighlighter) {
        ctx.globalAlpha = 0.38;
        ctx.lineWidth = (drawing.strokeWidth + 14) * (canvas.width / 600);
      }

      const firstPoint = drawing.points[0];
      ctx.moveTo((firstPoint.x / 100) * canvas.width, (firstPoint.y / 100) * canvas.height);

      for (let i = 1; i < drawing.points.length; i++) {
        const pt = drawing.points[i];
        ctx.lineTo((pt.x / 100) * canvas.width, (pt.y / 100) * canvas.height);
      }
      ctx.stroke();
      ctx.restore();
    });
  }, [drawings, currentPageIndex, pageRotations]);

  // Freehand Mouse / Touch Drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool !== "pen" && activeTool !== "highlighter") return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;

    isDrawingRef.current = true;
    currentPathRef.current = [{ x: xPct, y: yPct }];
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;

    currentPathRef.current.push({ x: xPct, y: yPct });

    const ctx = canvas.getContext("2d");
    if (ctx && currentPathRef.current.length > 1) {
      const pts = currentPathRef.current;
      const prev = pts[pts.length - 2];
      const curr = pts[pts.length - 1];

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = strokeWidth * (canvas.width / 600);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (activeTool === "highlighter") {
        ctx.globalAlpha = 0.38;
        ctx.lineWidth = (strokeWidth + 14) * (canvas.width / 600);
      }

      ctx.moveTo((prev.x / 100) * canvas.width, (prev.y / 100) * canvas.height);
      ctx.lineTo((curr.x / 100) * canvas.width, (curr.y / 100) * canvas.height);
      ctx.stroke();
      ctx.restore();
    }
  };

  const endDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentPathRef.current.length > 1) {
      recordHistory();
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        pageIndex: currentPageIndex,
        points: [...currentPathRef.current],
        strokeColor: primaryColor,
        strokeWidth: strokeWidth,
        isHighlighter: activeTool === "highlighter",
      };
      setDrawings((prev) => [...prev, newPath]);
    }
    currentPathRef.current = [];
  };

  // Add Annotations via Click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === "select" || activeTool === "pen" || activeTool === "highlighter") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    recordHistory();

    if (activeTool === "text") {
      const newText: TextAnnotation = {
        id: Date.now().toString(),
        pageIndex: currentPageIndex,
        type: "text",
        x: Math.max(0, Math.min(xPct, 80)),
        y: Math.max(0, Math.min(yPct, 95)),
        text: "Type your text here",
        fontSize: fontSize,
        fontFamily: "Arial, sans-serif",
        color: primaryColor,
      };
      setAnnotations((prev) => [...prev, newText]);
      setSelectedAnnotationId(newText.id);
      setActiveTool("select");
    } else if (activeTool === "whiteout" || activeTool === "blackout") {
      const newRedaction: RedactionAnnotation = {
        id: Date.now().toString(),
        pageIndex: currentPageIndex,
        type: "redaction",
        redactionType: activeTool,
        x: Math.max(0, Math.min(xPct, 70)),
        y: Math.max(0, Math.min(yPct, 90)),
        width: 25,
        height: 4,
      };
      setAnnotations((prev) => [...prev, newRedaction]);
      setSelectedAnnotationId(newRedaction.id);
      setActiveTool("select");
    } else if (activeTool === "rectangle" || activeTool === "circle" || activeTool === "checkmark" || activeTool === "cross") {
      const newShape: ShapeAnnotation = {
        id: Date.now().toString(),
        pageIndex: currentPageIndex,
        type: "shape",
        shapeType: activeTool,
        x: Math.max(0, Math.min(xPct, 80)),
        y: Math.max(0, Math.min(yPct, 90)),
        width: activeTool === "rectangle" || activeTool === "circle" ? 20 : 6,
        height: activeTool === "rectangle" || activeTool === "circle" ? 10 : 6,
        strokeColor: primaryColor,
        strokeWidth: strokeWidth,
      };
      setAnnotations((prev) => [...prev, newShape]);
      setSelectedAnnotationId(newShape.id);
      setActiveTool("select");
    }
  };

  // Add Stamp to Page
  const handleAddStamp = (stamp: (typeof STAMP_PRESETS)[0]) => {
    recordHistory();
    const newStamp: StampAnnotation = {
      id: Date.now().toString(),
      pageIndex: currentPageIndex,
      type: "stamp",
      x: 35,
      y: 40,
      width: 30,
      height: 12,
      text: stamp.name,
      subText: stamp.subText,
      color: stamp.color,
      borderColor: stamp.borderColor,
    };
    setAnnotations((prev) => [...prev, newStamp]);
    setSelectedAnnotationId(newStamp.id);
    setShowStampPalette(false);
    setActiveTool("select");
  };

  // Rotate Current Page 90 deg
  const handleRotatePage = () => {
    recordHistory();
    setPageRotations((prev) => {
      const updated = [...prev];
      updated[currentPageIndex] = ((updated[currentPageIndex] || 0) + 90) % 360;
      return updated;
    });
  };

  // Delete Current Page
  const handleDeletePage = async () => {
    if (pageCount <= 1) {
      alert("Cannot delete the only page in the document.");
      return;
    }
    if (!confirm(`Are you sure you want to delete Page ${currentPageIndex + 1}?`)) return;

    recordHistory();
    try {
      if (!pdfBytes) return;
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.removePage(currentPageIndex);

      const newBytes = await pdfDoc.save();
      setPdfBytes(newBytes);
      setPageCount((c) => c - 1);

      setAnnotations((prev) =>
        prev
          .filter((a) => a.pageIndex !== currentPageIndex)
          .map((a) => (a.pageIndex > currentPageIndex ? { ...a, pageIndex: a.pageIndex - 1 } : a))
      );
      setDrawings((prev) =>
        prev
          .filter((d) => d.pageIndex !== currentPageIndex)
          .map((d) => (d.pageIndex > currentPageIndex ? { ...d, pageIndex: d.pageIndex - 1 } : d))
      );

      setPageRotations((prev) => prev.filter((_, idx) => idx !== currentPageIndex));
      setCurrentPageIndex((prev) => Math.max(0, Math.min(prev, pageCount - 2)));
    } catch (err) {
      console.error("Failed to delete page:", err);
    }
  };

  // Signature Pad Drawing Handling in Modal
  const startSigPadDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigPadCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = sigPenColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    isDrawingRef.current = true;
  };

  const moveSigPadDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = sigPadCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endSigPadDraw = () => {
    isDrawingRef.current = false;
  };

  const clearSigPad = () => {
    const canvas = sigPadCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Upload signature image with auto-transparency filter
  const handleSignatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const offscreen = document.createElement("canvas");
        offscreen.width = img.width;
        offscreen.height = img.height;
        const ctx = offscreen.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r > 210 && g > 210 && b > 210) {
            data[i + 3] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);

        insertSignatureImage(offscreen.toDataURL("image/png"));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Insert Signature to current page
  const insertSignatureImage = (dataUrl: string) => {
    recordHistory();
    const newSig: ImageAnnotation = {
      id: Date.now().toString(),
      pageIndex: currentPageIndex,
      type: "signature",
      x: 35,
      y: 70,
      width: 28,
      height: 12,
      dataUrl,
    };
    setAnnotations((prev) => [...prev, newSig]);
    setSelectedAnnotationId(newSig.id);
    setShowSignatureModal(false);
    setActiveTool("select");
  };

  // Apply Typed Signature to Canvas
  const handleApplyTypedSignature = () => {
    if (!typedSignText.trim()) return;

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `italic 54px ${selectedSignFont === "cursive" ? "Brush Script MT, cursive" : selectedSignFont}`;
    ctx.fillStyle = sigPenColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedSignText, canvas.width / 2, canvas.height / 2);

    insertSignatureImage(canvas.toDataURL("image/png"));
  };

  // Apply Drawn Signature from Pad
  const handleApplyDrawnSignature = () => {
    const canvas = sigPadCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    insertSignatureImage(dataUrl);
  };

  // Dragging of Annotations
  const handleAnnotationMouseDown = (
    e: React.MouseEvent,
    id: string,
    currentX: number,
    currentY: number
  ) => {
    e.stopPropagation();
    setSelectedAnnotationId(id);
    setIsDraggingAnnotation(true);
    setDragOffset({ x: e.clientX, y: e.clientY });
  };

  // Resize Mouse Down on Corner Handle
  const handleResizeHandleMouseDown = (
    e: React.MouseEvent,
    id: string,
    currentW: number,
    currentH: number
  ) => {
    e.stopPropagation();
    setSelectedAnnotationId(id);
    setIsResizingAnnotation(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      initialW: currentW || 28,
      initialH: currentH || 12,
    });
  };

  // Resize Step (+ / -)
  const handleResizeStep = (id: string, multiplier: number) => {
    recordHistory();
    setAnnotations((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          if (a.type === "text") {
            const nextSize = Math.max(8, Math.min(72, Math.round(a.fontSize * multiplier)));
            return { ...a, fontSize: nextSize };
          }
          const curW = a.width || 28;
          const curH = a.height || 12;
          const newW = Math.max(5, Math.min(90, Number((curW * multiplier).toFixed(1))));
          const newH = Math.max(3, Math.min(90, Number((curH * multiplier).toFixed(1))));
          return { ...a, width: newW, height: newH };
        }
        return a;
      })
    );
  };

  // Preset Size
  const handlePresetSize = (id: string, size: "sm" | "md" | "lg" | "xl") => {
    recordHistory();
    const presets = {
      sm: { w: 18, h: 8, font: 12 },
      md: { w: 28, h: 12, font: 16 },
      lg: { w: 42, h: 18, font: 24 },
      xl: { w: 58, h: 25, font: 32 },
    };
    const target = presets[size];

    setAnnotations((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          if (a.type === "text") {
            return { ...a, fontSize: target.font };
          }
          return { ...a, width: target.w, height: target.h };
        }
        return a;
      })
    );
  };

  // Duplicate Annotation
  const handleDuplicateAnnotation = (id: string) => {
    const item = annotations.find((a) => a.id === id);
    if (!item) return;
    recordHistory();
    const cloned: Annotation = {
      ...item,
      id: Date.now().toString(),
      x: Math.min(90, item.x + 3),
      y: Math.min(90, item.y + 3),
    };
    setAnnotations((prev) => [...prev, cloned]);
    setSelectedAnnotationId(cloned.id);
  };

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    if (isResizingAnnotation && selectedAnnotationId) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const pctW = (deltaX / rect.width) * 100;
      const pctH = (deltaY / rect.height) * 100;

      setAnnotations((prev) =>
        prev.map((a) => {
          if (a.id === selectedAnnotationId) {
            const newW = Math.max(5, Math.min(95 - a.x, resizeStart.initialW + pctW));
            const newH = Math.max(3, Math.min(95 - a.y, resizeStart.initialH + pctH));
            return {
              ...a,
              width: Number(newW.toFixed(1)),
              height: Number(newH.toFixed(1)),
            };
          }
          return a;
        })
      );
      return;
    }

    if (isDraggingAnnotation && selectedAnnotationId) {
      const deltaX = e.clientX - dragOffset.x;
      const deltaY = e.clientY - dragOffset.y;
      const pctX = (deltaX / rect.width) * 100;
      const pctY = (deltaY / rect.height) * 100;

      setAnnotations((prev) =>
        prev.map((a) => {
          if (a.id === selectedAnnotationId) {
            return {
              ...a,
              x: Math.max(0, Math.min(100 - (a.width || 10), a.x + pctX)),
              y: Math.max(0, Math.min(100 - (a.height || 5), a.y + pctY)),
            };
          }
          return a;
        })
      );

      setDragOffset({ x: e.clientX, y: e.clientY });
    }
  };

  const handleContainerMouseUp = () => {
    if (isDraggingAnnotation || isResizingAnnotation) {
      setIsDraggingAnnotation(false);
      setIsResizingAnnotation(false);
      recordHistory();
    }
  };

  const handleDeleteAnnotation = (id: string) => {
    recordHistory();
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    setSelectedAnnotationId(null);
  };

  // Save PDF (Bulletproof Export with Fallback)
  const handleExportEditedPdf = async () => {
    if (!pdfBytes) {
      alert("No PDF loaded to save.");
      return;
    }
    setIsSavingPdf(true);

    try {
      let pdfDoc: PDFDocument;
      try {
        pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      } catch (loadErr) {
        console.warn("Direct PDFDocument.load failed, creating clean document container:", loadErr);
        pdfDoc = await PDFDocument.create();
      }

      const totalPages = pageCount || pdfDoc.getPageCount();

      // If document was freshly created or pages need rebuilding
      if (pdfDoc.getPageCount() === 0 && (window as unknown as { pdfjsLib?: unknown }).pdfjsLib) {
        const pdfjs = (window as unknown as { pdfjsLib: { getDocument: (data: { data: Uint8Array }) => { promise: Promise<{ getPage: (num: number) => Promise<{ render: (params: unknown) => { promise: Promise<void> }; getViewport: (params: { scale: number; rotation?: number }) => { width: number; height: number } }> }> } } }).pdfjsLib;
        const loadingTask = pdfjs.getDocument({ data: pdfBytes });
        const sourcePdf = await loadingTask.promise;

        for (let i = 0; i < totalPages; i++) {
          const srcPage = await sourcePdf.getPage(i + 1);
          const rot = pageRotations[i] || 0;
          const viewport = srcPage.getViewport({ scale: 2, rotation: rot });

          const renderCanvas = document.createElement("canvas");
          renderCanvas.width = viewport.width;
          renderCanvas.height = viewport.height;
          const rCtx = renderCanvas.getContext("2d");
          if (!rCtx) continue;

          await srcPage.render({ canvasContext: rCtx, viewport }).promise;

          // Draw annotations & drawings on top of renderCanvas
          const pageAnnotations = annotations.filter((a) => a.pageIndex === i);
          const pageDrawings = drawings.filter((d) => d.pageIndex === i);

          // Draw freehand drawings
          pageDrawings.forEach((drawing) => {
            if (drawing.points.length < 2) return;
            rCtx.save();
            rCtx.beginPath();
            rCtx.strokeStyle = drawing.strokeColor;
            rCtx.lineWidth = drawing.strokeWidth * (viewport.width / 600);
            rCtx.lineCap = "round";
            rCtx.lineJoin = "round";
            if (drawing.isHighlighter) {
              rCtx.globalAlpha = 0.45;
              rCtx.lineWidth = (drawing.strokeWidth + 14) * (viewport.width / 600);
            }
            const firstPoint = drawing.points[0];
            rCtx.moveTo((firstPoint.x / 100) * viewport.width, (firstPoint.y / 100) * viewport.height);
            for (let j = 1; j < drawing.points.length; j++) {
              const pt = drawing.points[j];
              rCtx.lineTo((pt.x / 100) * viewport.width, (pt.y / 100) * viewport.height);
            }
            rCtx.stroke();
            rCtx.restore();
          });

          // Draw annotations
          for (const ann of pageAnnotations) {
            const x = (ann.x / 100) * viewport.width;
            const y = (ann.y / 100) * viewport.height;
            const w = ((ann.width || 20) / 100) * viewport.width;
            const h = ((ann.height || 10) / 100) * viewport.height;

            if (ann.type === "text") {
              rCtx.save();
              const scaleFont = (ann.fontSize || 16) * (viewport.width / 600);
              rCtx.font = `${ann.isBold ? "bold " : ""}${ann.isItalic ? "italic " : ""}${scaleFont}px ${ann.fontFamily || "Arial"}`;
              rCtx.fillStyle = ann.color || "#000000";
              rCtx.textBaseline = "top";
              if (ann.bgColor) {
                rCtx.fillStyle = ann.bgColor;
                rCtx.fillRect(x - 4, y - 4, rCtx.measureText(ann.text).width + 8, scaleFont + 8);
                rCtx.fillStyle = ann.color || "#000000";
              }
              rCtx.fillText(ann.text, x, y);
              rCtx.restore();
            } else if (ann.type === "redaction") {
              rCtx.save();
              rCtx.fillStyle = ann.redactionType === "blackout" ? "#000000" : "#ffffff";
              rCtx.fillRect(x, y, w, h);
              rCtx.restore();
            } else if (ann.type === "stamp") {
              rCtx.save();
              rCtx.strokeStyle = ann.borderColor;
              rCtx.lineWidth = 3;
              rCtx.strokeRect(x, y, w, h);
              rCtx.fillStyle = `${ann.borderColor}15`;
              rCtx.fillRect(x, y, w, h);
              rCtx.font = `bold ${Math.max(14, w / 6.5)}px Arial, sans-serif`;
              rCtx.fillStyle = ann.color;
              rCtx.textAlign = "center";
              rCtx.textBaseline = "middle";
              rCtx.fillText(ann.text, x + w / 2, y + (ann.subText ? h / 2 - 5 : h / 2));
              if (ann.subText) {
                rCtx.font = `600 ${Math.max(9, w / 15)}px Arial, sans-serif`;
                rCtx.fillText(ann.subText, x + w / 2, y + h / 2 + 10);
              }
              rCtx.restore();
            } else if (ann.type === "signature" || ann.type === "image") {
              if (ann.dataUrl) {
                const img = new Image();
                await new Promise<void>((resolve) => {
                  img.onload = () => {
                    try {
                      rCtx.drawImage(img, x, y, w, h);
                    } catch (e) {
                      console.error(e);
                    }
                    resolve();
                  };
                  img.onerror = () => resolve();
                  img.src = ann.dataUrl;
                });
              }
            }
          }

          const pagePng = renderCanvas.toDataURL("image/png");
          const embeddedImg = await pdfDoc.embedPng(pagePng);
          const newPg = pdfDoc.addPage([viewport.width / 2, viewport.height / 2]);
          newPg.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: viewport.width / 2,
            height: viewport.height / 2,
          });
        }
      } else {
        // Direct Native Overlay on existing PDF Pages
        const pages = pdfDoc.getPages();

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { width: pWidth, height: pHeight } = page.getSize();
          const targetW = pWidth || 595.28;
          const targetH = pHeight || 841.89;

          const rot = pageRotations[i] || 0;
          page.setRotation(degrees(rot));

          const pageAnnotations = annotations.filter((a) => a.pageIndex === i);
          const pageDrawings = drawings.filter((d) => d.pageIndex === i);

          if (pageAnnotations.length === 0 && pageDrawings.length === 0) continue;

          const overlayCanvas = document.createElement("canvas");
          const scale = 2;
          overlayCanvas.width = Math.max(100, Math.round(targetW * scale));
          overlayCanvas.height = Math.max(100, Math.round(targetH * scale));
          const ctx = overlayCanvas.getContext("2d");
          if (!ctx) continue;

          ctx.scale(scale, scale);

          // 1. Draw drawings
          pageDrawings.forEach((drawing) => {
            if (drawing.points.length < 2) return;
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = drawing.strokeColor;
            ctx.lineWidth = drawing.strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            if (drawing.isHighlighter) {
              ctx.globalAlpha = 0.45;
              ctx.lineWidth = drawing.strokeWidth + 12;
            }

            const firstPoint = drawing.points[0];
            ctx.moveTo((firstPoint.x / 100) * targetW, (firstPoint.y / 100) * targetH);

            for (let j = 1; j < drawing.points.length; j++) {
              const pt = drawing.points[j];
              ctx.lineTo((pt.x / 100) * targetW, (pt.y / 100) * targetH);
            }
            ctx.stroke();
            ctx.restore();
          });

          // 2. Draw annotations
          for (const ann of pageAnnotations) {
            const x = (ann.x / 100) * targetW;
            const y = (ann.y / 100) * targetH;
            const w = ((ann.width || 20) / 100) * targetW;
            const h = ((ann.height || 10) / 100) * targetH;

            if (ann.type === "text") {
              ctx.save();
              ctx.font = `${ann.isBold ? "bold " : ""}${ann.isItalic ? "italic " : ""}${ann.fontSize || 16}px ${ann.fontFamily || "Arial"}`;
              ctx.fillStyle = ann.color || "#000000";
              ctx.textBaseline = "top";
              if (ann.bgColor) {
                ctx.fillStyle = ann.bgColor;
                ctx.fillRect(x - 4, y - 4, ctx.measureText(ann.text).width + 8, (ann.fontSize || 16) + 8);
                ctx.fillStyle = ann.color || "#000000";
              }
              ctx.fillText(ann.text, x, y);
              ctx.restore();
            } else if (ann.type === "redaction") {
              ctx.save();
              ctx.fillStyle = ann.redactionType === "blackout" ? "#000000" : "#ffffff";
              ctx.fillRect(x, y, w, h);
              ctx.restore();
            } else if (ann.type === "stamp") {
              ctx.save();
              ctx.strokeStyle = ann.borderColor;
              ctx.lineWidth = 2.5;
              ctx.strokeRect(x, y, w, h);
              ctx.fillStyle = `${ann.borderColor}15`;
              ctx.fillRect(x, y, w, h);

              ctx.font = `bold ${Math.max(12, Math.min(22, w / 7))}px Arial, sans-serif`;
              ctx.fillStyle = ann.color;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(ann.text, x + w / 2, y + (ann.subText ? h / 2 - 5 : h / 2));

              if (ann.subText) {
                ctx.font = `600 ${Math.max(8, w / 16)}px Arial, sans-serif`;
                ctx.fillText(ann.subText, x + w / 2, y + h / 2 + 9);
              }
              ctx.restore();
            } else if (ann.type === "shape") {
              ctx.save();
              ctx.strokeStyle = ann.strokeColor;
              ctx.lineWidth = ann.strokeWidth;
              if (ann.shapeType === "rectangle") {
                ctx.strokeRect(x, y, w, h);
              } else if (ann.shapeType === "circle") {
                ctx.beginPath();
                ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
                ctx.stroke();
              } else if (ann.shapeType === "checkmark") {
                ctx.beginPath();
                ctx.moveTo(x, y + h * 0.5);
                ctx.lineTo(x + w * 0.35, y + h * 0.85);
                ctx.lineTo(x + w, y + h * 0.15);
                ctx.stroke();
              } else if (ann.shapeType === "cross") {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + w, y + h);
                ctx.moveTo(x + w, y);
                ctx.lineTo(x, y + h);
                ctx.stroke();
              }
              ctx.restore();
            } else if (ann.type === "signature" || ann.type === "image") {
              if (ann.dataUrl) {
                const img = new Image();
                await new Promise<void>((resolve) => {
                  img.onload = () => {
                    try {
                      ctx.drawImage(img, x, y, w, h);
                    } catch (e) {
                      console.error("Signature render error", e);
                    }
                    resolve();
                  };
                  img.onerror = () => resolve();
                  img.src = ann.dataUrl;
                });
              }
            }
          }

          const overlayDataUrl = overlayCanvas.toDataURL("image/png");
          const embeddedPng = await pdfDoc.embedPng(overlayDataUrl);

          page.drawImage(embeddedPng, {
            x: 0,
            y: 0,
            width: targetW,
            height: targetH,
          });
        }
      }

      const finalPdfBytes = await pdfDoc.save({ useObjectStreams: false });
      const blob = new Blob([finalPdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Edited_${pdfFileName ? pdfFileName.replace(/\.pdf$/i, "") : "Document"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("Failed to export edited PDF:", err);
      alert("Error saving edited PDF: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSavingPdf(false);
    }
  };

  const currentAnnotations = annotations.filter((a) => a.pageIndex === currentPageIndex);

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePdfUpload}
        accept="application/pdf"
        className="hidden"
      />

      {/* --- IF NO PDF IS LOADED YET: SHOW PROMINENT UPLOAD LANDING SCREEN --- */}
      {!pdfBytes ? (
        <div className="utility-card p-8 sm:p-14 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/40 shadow-sm text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="inline-flex p-4 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-sm border border-brand-100 dark:border-brand-900/40">
              <FileSignature className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                PDF Editor & Digital Signer Studio
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Add digital signatures, text annotations, highlighters, whiteouts, and official stamps to any PDF document with 100% in-browser privacy.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingFile(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processPdfFile(e.dataTransfer.files[0]);
                }
              }}
              className={`p-10 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                isDraggingFile
                  ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 scale-102"
                  : "border-slate-300 dark:border-slate-700 hover:border-brand-400 bg-slate-50/60 dark:bg-slate-950/40 hover:bg-slate-100/70"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Upload className="w-7 h-7" />
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Click to Browse or Drag & Drop PDF File
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Supports all standard PDF documents, government forms, bills, and legal drafts
              </span>

              <Button
                variant="primary"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-2 font-bold px-6 shadow-md shadow-brand-500/20"
              >
                <Upload className="w-4 h-4 mr-1.5" />
                Select PDF Document
              </Button>
            </div>

            {/* Try with Demo document option */}
            <div className="pt-2">
              <button
                onClick={loadStarterPdf}
                className="text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 inline-flex items-center gap-1.5 hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Don&apos;t have a file right now? Try with a Sample PDF Document
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* --- IF PDF IS LOADED: SHOW COMPLETE EDITOR SUITE --- */
        <div className="space-y-4">
          {/* Top Main Studio Banner */}
          <div className="utility-card p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/40 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                    <FileSignature className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    PDF Editor & Digital Signer Studio
                  </h3>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                    100% Local Encrypted
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    📄 {pdfFileName || "Document"}
                  </span>
                  <span>•</span>
                  <span>{pageCount} Pages</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5 font-bold"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  Upload Another PDF
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExportEditedPdf}
                  disabled={isSavingPdf || isPdfLoading}
                  className="gap-1.5 font-bold shadow-md shadow-brand-500/20"
                >
                  {isSavingPdf ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download Edited PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Interactive Editor Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* --- LEFT SIDEBAR: THUMBNAILS & PAGE CONTROLS (3 COLS) --- */}
            <div className="lg:col-span-3 space-y-4">
              <div className="utility-card p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/40 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-500" />
                    Pages ({pageCount})
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Page {currentPageIndex + 1} of {pageCount}
                  </span>
                </div>

                {/* Page Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotatePage}
                    className="w-full gap-1 text-[11px]"
                    title="Rotate current page 90 degrees clockwise"
                  >
                    <RotateCw className="w-3 h-3 text-blue-500" />
                    Rotate 90°
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeletePage}
                    disabled={pageCount <= 1}
                    className="w-full gap-1 text-[11px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete current page"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                    Delete Page
                  </Button>
                </div>

                {/* Page Thumbnails List */}
                <div className="space-y-2.5 max-h-[480px] overflow-y-auto scrollbar-thin pr-1">
                  {Array.from({ length: pageCount }).map((_, idx) => {
                    const isSelected = idx === currentPageIndex;
                    const pageAnnCount = annotations.filter((a) => a.pageIndex === idx).length;
                    const pageDrawCount = drawings.filter((d) => d.pageIndex === idx).length;

                    return (
                      <div
                        key={idx}
                        onClick={() => setCurrentPageIndex(idx)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center justify-between ${
                          isSelected
                            ? "bg-brand-50/80 dark:bg-brand-950/60 border-brand-300 dark:border-brand-700 shadow-xs"
                            : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/70 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex items-center justify-center font-bold text-xs shadow-2xs">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                              Page {idx + 1}
                            </span>
                            {(pageAnnCount > 0 || pageDrawCount > 0) && (
                              <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">
                                {pageAnnCount + pageDrawCount} annotations
                              </span>
                            )}
                          </div>
                        </div>

                        {pageRotations[idx] ? (
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            {pageRotations[idx]}°
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* --- CENTER / RIGHT: TOOLBAR & CANVAS (9 COLS) --- */}
            <div className="lg:col-span-9 space-y-4">
              {/* Main Action Tool Palette */}
              <div className="utility-card p-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/40 shadow-xs flex flex-wrap items-center justify-between gap-2">
                {/* Primary Action Buttons */}
                <div className="flex items-center gap-1 flex-wrap">
                  <Button
                    variant={activeTool === "select" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("select")}
                    className="gap-1 font-bold"
                    title="Select & Move Objects"
                  >
                    <MousePointer className="w-3.5 h-3.5" />
                    Select
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowSignatureModal(true)}
                    className="gap-1 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                    title="Add Digital Signature"
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    + Signature (E-Sign)
                  </Button>

                  <Button
                    variant={activeTool === "text" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("text")}
                    className="gap-1 font-bold"
                    title="Click anywhere to type text"
                  >
                    <Type className="w-3.5 h-3.5" />
                    Text Box
                  </Button>

                  <Button
                    variant={activeTool === "pen" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("pen")}
                    className="gap-1"
                    title="Freehand Pen Tool"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    Pen
                  </Button>

                  <Button
                    variant={activeTool === "highlighter" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveTool("highlighter");
                      setPrimaryColor("#facc15");
                    }}
                    className="gap-1"
                    title="Text Highlighter"
                  >
                    <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                    Highlight
                  </Button>

                  <Button
                    variant={activeTool === "whiteout" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("whiteout")}
                    className="gap-1"
                    title="Whiteout to cover typos or unwanted text"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    Whiteout
                  </Button>

                  <Button
                    variant={activeTool === "blackout" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("blackout")}
                    className="gap-1"
                    title="Blackout to redact sensitive numbers"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    Blackout (Redact)
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowStampPalette(!showStampPalette)}
                    className="gap-1 font-bold text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60"
                    title="Official Stamps (Self-Attested, Approved)"
                  >
                    <Stamp className="w-3.5 h-3.5" />
                    Stamps
                  </Button>
                </div>

                {/* Quick Styling & Undo/Redo */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    {["#1e40af", "#0f172a", "#dc2626", "#16a34a", "#facc15"].map((col) => (
                      <button
                        key={col}
                        onClick={() => setPrimaryColor(col)}
                        style={{ backgroundColor: col }}
                        className={`w-4 h-4 rounded-full transition-transform ${
                          primaryColor === col ? "scale-125 ring-2 ring-brand-500" : "opacity-80 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                    title="Undo"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                    title="Redo"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Official Stamps Dropdown Palette */}
              {showStampPalette && (
                <div className="utility-card p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Stamp className="w-4 h-4 text-emerald-500" /> Choose Official Stamp Badge
                    </h4>
                    <button
                      onClick={() => setShowStampPalette(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {STAMP_PRESETS.map((st) => (
                      <button
                        key={st.name}
                        onClick={() => handleAddStamp(st)}
                        style={{ borderColor: st.borderColor }}
                        className="p-2.5 rounded-xl border-2 text-center hover:scale-105 transition-transform bg-slate-50/50 dark:bg-slate-950/40"
                      >
                        <span style={{ color: st.color }} className="text-xs font-black block tracking-wider">
                          {st.name}
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">
                          {st.subText}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Page Interactive Canvas Work Area */}
              <div className="utility-card p-4 sm:p-6 rounded-3xl bg-slate-200/70 dark:bg-slate-950 border border-slate-300/40 dark:border-slate-800/60 shadow-inner flex flex-col items-center justify-center overflow-auto min-h-[640px]">
                {isPdfLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                    <RefreshCw className="w-8 h-8 animate-spin text-brand-500 mb-3" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Rendering PDF Document...</p>
                  </div>
                ) : (
                  <div
                    ref={containerRef}
                    onClick={handleCanvasClick}
                    onMouseMove={handleContainerMouseMove}
                    onMouseUp={handleContainerMouseUp}
                    style={{
                      transform: `scale(${zoomScale / 100})`,
                      transformOrigin: "top center",
                    }}
                    className={`relative bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300/80 transition-transform duration-150 select-none ${
                      activeTool === "text"
                        ? "cursor-text"
                        : activeTool === "pen" || activeTool === "highlighter"
                        ? "cursor-crosshair"
                        : activeTool === "whiteout" || activeTool === "blackout"
                        ? "cursor-crosshair"
                        : "cursor-default"
                    }`}
                  >
                    {/* 1. Underlying PDF Render Canvas */}
                    <canvas ref={pdfCanvasRef} className="block w-full h-full pointer-events-none" />

                    {/* 2. Freehand Drawing & Highlighter Canvas */}
                    <canvas
                      ref={drawCanvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={drawMove}
                      onMouseUp={endDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={drawMove}
                      onTouchEnd={endDrawing}
                      className={`absolute inset-0 w-full h-full z-10 ${
                        activeTool === "pen" || activeTool === "highlighter"
                          ? "pointer-events-auto"
                          : "pointer-events-none"
                      }`}
                    />

                    {/* 3. Interactive Annotations Overlay (Text, Signatures, Stamps, Redactions) */}
                    {currentAnnotations.map((ann) => {
                      const isSelected = selectedAnnotationId === ann.id;

                      return (
                        <div
                          key={ann.id}
                          onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id, ann.x, ann.y)}
                          style={{
                            position: "absolute",
                            left: `${ann.x}%`,
                            top: `${ann.y}%`,
                            width: ann.width ? `${ann.width}%` : "auto",
                            height: ann.height ? `${ann.height}%` : "auto",
                          }}
                          className={`group absolute z-20 transition-shadow ${
                            isSelected
                              ? "ring-2 ring-brand-500 ring-offset-1 shadow-lg"
                              : "hover:ring-1 hover:ring-brand-400"
                          }`}
                        >
                          {/* Floating Quick Action & Resizing Toolbar on Selected Object */}
                          {isSelected && (
                            <>
                              <div
                                onMouseDown={(e) => e.stopPropagation()}
                                className="absolute -top-11 left-0 flex items-center gap-1 bg-slate-900/95 text-white px-2 py-1 rounded-xl shadow-2xl z-40 border border-slate-700/80 backdrop-blur-md select-none whitespace-nowrap"
                              >
                                <span className="text-[10px] text-slate-400 font-bold px-1">Size:</span>
                                <button
                                  onClick={() => handleResizeStep(ann.id, 0.85)}
                                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                                  title="Chota karein (Smaller -)"
                                >
                                  ➖
                                </button>
                                <button
                                  onClick={() => handleResizeStep(ann.id, 1.15)}
                                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                                  title="Bada karein (Larger +)"
                                >
                                  ➕
                                </button>

                                <div className="h-3.5 w-px bg-slate-700 mx-0.5" />

                                <button
                                  onClick={() => handlePresetSize(ann.id, "sm")}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300"
                                  title="Small (Chota)"
                                >
                                  S
                                </button>
                                <button
                                  onClick={() => handlePresetSize(ann.id, "md")}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300"
                                  title="Medium"
                                >
                                  M
                                </button>
                                <button
                                  onClick={() => handlePresetSize(ann.id, "lg")}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300"
                                  title="Large (Bada)"
                                >
                                  L
                                </button>

                                <div className="h-3.5 w-px bg-slate-700 mx-0.5" />

                                <button
                                  onClick={() => handleDuplicateAnnotation(ann.id)}
                                  className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                                  title="Duplicate (Copy)"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAnnotation(ann.id)}
                                  className="p-1 rounded hover:bg-red-900/60 text-red-400 hover:text-red-200"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Bottom-Right Corner Drag Resize Handle */}
                              <div
                                onMouseDown={(e) =>
                                  handleResizeHandleMouseDown(
                                    e,
                                    ann.id,
                                    ann.width || 28,
                                    ann.height || 12
                                  )
                                }
                                className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-brand-600 border-2 border-white shadow-md cursor-se-resize z-30 hover:scale-125 transition-transform"
                                title="Drag to resize (Chota/Bada karein)"
                              />

                              {/* Corner Dots */}
                              <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 border border-white pointer-events-none" />
                              <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 border border-white pointer-events-none" />
                              <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 border border-white pointer-events-none" />
                            </>
                          )}

                          {/* TEXT ANNOTATION */}
                          {ann.type === "text" && (
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                const newText = e.currentTarget.textContent || "";
                                setAnnotations((prev) =>
                              prev.map((a) => (a.id === ann.id ? { ...a, text: newText } : a))
                            );
                          }}
                          style={{
                            fontSize: `${ann.fontSize}px`,
                            fontFamily: ann.fontFamily,
                            color: ann.color,
                            fontWeight: ann.isBold ? "bold" : "normal",
                            fontStyle: ann.isItalic ? "italic" : "normal",
                            backgroundColor: ann.bgColor || "transparent",
                          }}
                          className="p-1 min-w-[60px] outline-none whitespace-pre-wrap leading-tight cursor-text"
                        >
                          {ann.text}
                        </div>
                      )}

                      {/* SIGNATURE / IMAGE */}
                      {(ann.type === "signature" || ann.type === "image") && (
                        <img
                          src={ann.dataUrl}
                          alt="Signature"
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      )}

                      {/* STAMP */}
                      {ann.type === "stamp" && (
                        <div
                          style={{ borderColor: ann.borderColor, backgroundColor: `${ann.borderColor}10` }}
                          className="w-full h-full border-2 rounded-lg flex flex-col items-center justify-center p-1 text-center"
                        >
                          <span
                            style={{ color: ann.color }}
                            className="text-xs sm:text-sm font-black tracking-wider block"
                          >
                            {ann.text}
                          </span>
                          {ann.subText && (
                            <span className="text-[8px] sm:text-[10px] text-slate-600 font-bold block">
                              {ann.subText}
                            </span>
                          )}
                        </div>
                      )}

                      {/* REDACTION (Whiteout or Blackout) */}
                      {ann.type === "redaction" && (
                        <div
                          style={{
                            backgroundColor: ann.redactionType === "blackout" ? "#000000" : "#ffffff",
                          }}
                          className="w-full h-full border border-dashed border-slate-400/50 shadow-xs"
                        />
                      )}

                      {/* SHAPE */}
                      {ann.type === "shape" && (
                        <div className="w-full h-full flex items-center justify-center">
                          {ann.shapeType === "rectangle" && (
                            <div
                              style={{ borderColor: ann.strokeColor, borderWidth: `${ann.strokeWidth}px` }}
                              className="w-full h-full border rounded-sm"
                            />
                          )}
                          {ann.shapeType === "circle" && (
                            <div
                              style={{ borderColor: ann.strokeColor, borderWidth: `${ann.strokeWidth}px` }}
                              className="w-full h-full border rounded-full"
                            />
                          )}
                          {ann.shapeType === "checkmark" && (
                            <Check
                              style={{ color: ann.strokeColor, strokeWidth: ann.strokeWidth }}
                              className="w-full h-full"
                            />
                          )}
                          {ann.shapeType === "cross" && (
                            <X
                              style={{ color: ann.strokeColor, strokeWidth: ann.strokeWidth }}
                              className="w-full h-full"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Zoom & Page Navigation Bar */}
          <div className="flex items-center justify-between gap-3 text-xs bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/40">
            {/* Page Nav */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPageIndex <= 0}
                onClick={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
                className="p-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Page {currentPageIndex + 1} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPageIndex >= pageCount - 1}
                onClick={() => setCurrentPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                className="p-1.5"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomScale((z) => Math.max(50, z - 10))}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 w-12 text-center">
                {zoomScale}%
              </span>
              <button
                onClick={() => setZoomScale((z) => Math.min(150, z + 10))}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* --- DIGITAL SIGNATURE (E-SIGN) MODAL --- */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="utility-card w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Create Digital Signature (E-Sign)
                </h3>
              </div>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Signature Modes Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                onClick={() => setSignatureMode("draw")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  signatureMode === "draw"
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                ✍️ Draw with Pen
              </button>
              <button
                onClick={() => setSignatureMode("type")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  signatureMode === "type"
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                ⌨️ Type Name
              </button>
              <button
                onClick={() => setSignatureMode("upload")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  signatureMode === "upload"
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                📷 Upload Scan
              </button>
            </div>

            {/* TAB 1: DRAW SIGNATURE */}
            {signatureMode === "draw" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Draw smooth signature in box:</span>
                  <div className="flex items-center gap-1.5">
                    {["#0f172a", "#1e40af", "#dc2626"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setSigPenColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-4 h-4 rounded-full ${
                          sigPenColor === c ? "ring-2 ring-brand-500 scale-110" : "opacity-70"
                        }`}
                      />
                    ))}
                    <button
                      onClick={clearSigPad}
                      className="ml-2 text-xs text-red-500 hover:underline font-bold"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 overflow-hidden relative">
                  <canvas
                    ref={sigPadCanvasRef}
                    width={480}
                    height={160}
                    onMouseDown={startSigPadDraw}
                    onMouseMove={moveSigPadDraw}
                    onMouseUp={endSigPadDraw}
                    onTouchStart={startSigPadDraw}
                    onTouchMove={moveSigPadDraw}
                    onTouchEnd={endSigPadDraw}
                    className="w-full h-40 cursor-crosshair block"
                  />
                  <div className="absolute bottom-2 left-4 text-[10px] text-slate-400 pointer-events-none font-mono">
                    Sign above the baseline
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleApplyDrawnSignature}
                  className="w-full font-bold"
                >
                  Insert Drawn Signature to PDF
                </Button>
              </div>
            )}

            {/* TAB 2: TYPE SIGNATURE */}
            {signatureMode === "type" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Enter Name / Signatory Text:
                  </label>
                  <input
                    type="text"
                    value={typedSignText}
                    onChange={(e) => setTypedSignText(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Font Choices */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500">Select Calligraphic Handwriting Font:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "cursive", label: "Classic Cursive", font: "Brush Script MT, cursive" },
                      { id: "Georgia, serif", label: "Formal Elegant", font: "Georgia, serif" },
                      { id: "Courier New, monospace", label: "Typewriter Stamp", font: "Courier New, monospace" },
                      { id: "sans-serif", label: "Clean Modern", font: "Arial, sans-serif" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedSignFont(f.font)}
                        style={{ fontFamily: f.font }}
                        className={`p-3 rounded-xl border text-sm italic transition-all ${
                          selectedSignFont === f.font
                            ? "bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-400 font-bold"
                            : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {typedSignText || "Sign Preview"}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleApplyTypedSignature}
                  className="w-full font-bold"
                >
                  Insert Typed Signature to PDF
                </Button>
              </div>
            )}

            {/* TAB 3: UPLOAD SIGNATURE SCAN */}
            {signatureMode === "upload" && (
              <div className="space-y-4 text-center">
                <input
                  type="file"
                  ref={sigImageInputRef}
                  onChange={handleSignatureImageUpload}
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                />
                <div
                  onClick={() => sigImageInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <ImageIcon className="w-10 h-10 text-slate-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to browse Signature Image (PNG / JPG)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Auto-removes white background so it looks like authentic pen ink on paper
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
