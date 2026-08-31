"use client";
import React, { useState } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FileText, Download, Briefcase, User, GraduationCap, Heart, Plus, Trash2, RefreshCw } from "lucide-react";

interface EducationItem {
  degree: string;
  school: string;
  year: string;
  percentage: string;
}

interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  details: string;
}

export default function BiodataGenerator() {
  const [template, setTemplate] = useState<"resume" | "biodata">("resume");

  // Form States
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  
  // Marriage Biodata specific details
  const [religion, setReligion] = useState<string>("");
  const [caste, setCaste] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("Never Married");
  const [fatherName, setFatherName] = useState<string>("");
  const [fatherOccupation, setFatherOccupation] = useState<string>("");
  const [motherName, setMotherName] = useState<string>("");
  const [siblings, setSiblings] = useState<string>("");

  // Lists
  const [education, setEducation] = useState<EducationItem[]>([
    { degree: "10th Standard", school: "Secondary Board", year: "2018", percentage: "85%" },
  ]);
  const [experience, setExperience] = useState<ExperienceItem[]>([
    { role: "Junior Developer", company: "Tech Sol India", duration: "1 Year", details: "Maintained client-side web utility portals." },
  ]);

  const [generating, setGenerating] = useState<boolean>(false);

  const handleAddEducation = () => {
    setEducation((prev) => [...prev, { degree: "", school: "", year: "", percentage: "" }]);
  };

  const handleRemoveEducation = (idx: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddExperience = () => {
    setExperience((prev) => [...prev, { role: "", company: "", duration: "", details: "" }]);
  };

  const handleRemoveExperience = (idx: number) => {
    setExperience((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGeneratePdf = async () => {
    if (!name.trim()) {
      alert("Please enter at least the candidate's name!");
      return;
    }
    setGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
      const { width, height: pageHeight } = page.getSize();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let currentY = pageHeight - 60;

      // Draw Main Header Title
      page.drawText(name.toUpperCase(), {
        x: 50,
        y: currentY,
        size: 20,
        font: boldFont,
        color: rgb(0.23, 0.51, 0.96), // Royal Blue
      });
      currentY -= 22;

      // Draw Contact/Email Details line
      const contactStr = `${phone ? "Phone: " + phone : ""} ${email ? " | Email: " + email : ""} ${dob ? " | DOB: " + dob : ""}`;
      page.drawText(contactStr.trim(), {
        x: 50,
        y: currentY,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      currentY -= 15;

      if (address) {
        page.drawText(`Address: ${address}`, {
          x: 50,
          y: currentY,
          size: 10,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });
        currentY -= 20;
      }

      // Draw dividing header line
      page.drawLine({
        start: { x: 50, y: currentY },
        end: { x: width - 50, y: currentY },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      currentY -= 25;

      if (template === "resume") {
        // PROFESSIONAL RESUME TEMPLATE

        // SECTION: Education
        page.drawText("EDUCATION & QUALIFICATIONS", {
          x: 50,
          y: currentY,
          size: 12,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 18;

        education.forEach((edu) => {
          if (!edu.degree) return;
          page.drawText(`${edu.degree} - ${edu.school}`, {
            x: 60,
            y: currentY,
            size: 10,
            font: boldFont,
            color: rgb(0.2, 0.2, 0.2),
          });
          page.drawText(`Year: ${edu.year} | Marks: ${edu.percentage}`, {
            x: width - 180,
            y: currentY,
            size: 10,
            font: font,
            color: rgb(0.4, 0.4, 0.4),
          });
          currentY -= 16;
        });
        currentY -= 15;

        // SECTION: Experience
        page.drawText("PROFESSIONAL EXPERIENCE", {
          x: 50,
          y: currentY,
          size: 12,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 18;

        experience.forEach((exp) => {
          if (!exp.role) return;
          page.drawText(`${exp.role} at ${exp.company}`, {
            x: 60,
            y: currentY,
            size: 10,
            font: boldFont,
            color: rgb(0.2, 0.2, 0.2),
          });
          page.drawText(`Duration: ${exp.duration}`, {
            x: width - 180,
            y: currentY,
            size: 10,
            font: font,
            color: rgb(0.4, 0.4, 0.4),
          });
          currentY -= 15;
          
          if (exp.details) {
            page.drawText(`Details: ${exp.details}`, {
              x: 70,
              y: currentY,
              size: 9,
              font: font,
              color: rgb(0.4, 0.4, 0.4),
            });
            currentY -= 16;
          }
          currentY -= 4;
        });

      } else {
        // MARRIAGE BIODATA TEMPLATE

        // SECTION: Personal Details
        page.drawText("PERSONAL INFORMATION", {
          x: 50,
          y: currentY,
          size: 12,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 18;

        const personalItems = [
          { label: "Religion & Caste", val: `${religion} ${caste ? " - " + caste : ""}` },
          { label: "Height", val: height },
          { label: "Marital Status", val: maritalStatus },
        ];

        personalItems.forEach((item) => {
          if (!item.val.trim()) return;
          page.drawText(`${item.label}:`, { x: 60, y: currentY, size: 10, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
          page.drawText(item.val, { x: 200, y: currentY, size: 10, font: font, color: rgb(0.1, 0.1, 0.1) });
          currentY -= 16;
        });
        currentY -= 10;

        // SECTION: Family Background
        page.drawText("FAMILY BACKGROUND", {
          x: 50,
          y: currentY,
          size: 12,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 18;

        const familyItems = [
          { label: "Father's Name", val: fatherName },
          { label: "Father's Occupation", val: fatherOccupation },
          { label: "Mother's Name", val: motherName },
          { label: "Siblings details", val: siblings },
        ];

        familyItems.forEach((item) => {
          if (!item.val.trim()) return;
          page.drawText(`${item.label}:`, { x: 60, y: currentY, size: 10, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
          page.drawText(item.val, { x: 200, y: currentY, size: 10, font: font, color: rgb(0.1, 0.1, 0.1) });
          currentY -= 16;
        });
        currentY -= 10;

        // SECTION: Education
        page.drawText("EDUCATION & DETAILS", {
          x: 50,
          y: currentY,
          size: 12,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 18;

        education.forEach((edu) => {
          if (!edu.degree) return;
          page.drawText(`${edu.degree} - ${edu.school}`, {
            x: 60,
            y: currentY,
            size: 10,
            font: font,
            color: rgb(0.2, 0.2, 0.2),
          });
          page.drawText(`Year: ${edu.year} | ${edu.percentage}`, {
            x: width - 180,
            y: currentY,
            size: 10,
            font: font,
            color: rgb(0.4, 0.4, 0.4),
          });
          currentY -= 16;
        });
      }

      // Draw footer badge
      page.drawText("Generated via BharatKits Portal", {
        x: 50,
        y: 40,
        size: 8,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name.toLowerCase().replace(/\s+/g, "_")}_${template}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Error printing Biodata card. Try filling details again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Template Toggles and personal forms */}
      <div className="lg:col-span-7 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <CardTitle>Biodata & Resume Builder</CardTitle>
              <CardDescription>Live template generator</CardDescription>
            </div>
            <div className="flex gap-1 bg-slate-100/80 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-850">
              <button
                type="button"
                onClick={() => setTemplate("resume")}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                  template === "resume" ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm" : "text-slate-500"
                }`}
              >
                Resume
              </button>
              <button
                type="button"
                onClick={() => setTemplate("biodata")}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                  template === "biodata" ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm" : "text-slate-500"
                }`}
              >
                Biodata
              </button>
            </div>
          </div>

          {/* Form Personal Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-600" /> Candidate Personal Information
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Full Name</span>
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">DOB / Age</span>
                <input
                  type="text"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Contact Phone</span>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Email ID</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Postal Address</span>
              <input
                type="text"
                placeholder="Full correspondence address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
              />
            </div>
          </div>

          {/* Form Marriage Details specific */}
          {template === "biodata" && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" /> Marital & Family Attributes
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Religion</span>
                  <input
                    type="text"
                    placeholder="e.g. Hindu, Sikh"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Caste</span>
                  <input
                    type="text"
                    placeholder="e.g. Brahmin, General"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Height</span>
                  <input
                    type="text"
                    placeholder="e.g. 5ft 8in or 172cm"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Father's Name</span>
                  <input
                    type="text"
                    placeholder="Father's full name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Father's Occupation</span>
                  <input
                    type="text"
                    placeholder="e.g. Business, Retired"
                    value={fatherOccupation}
                    onChange={(e) => setFatherOccupation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Mother's Name</span>
                  <input
                    type="text"
                    placeholder="Mother's name"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Siblings Details</span>
                  <input
                    type="text"
                    placeholder="e.g. 1 Brother, 1 Sister"
                    value={siblings}
                    onChange={(e) => setSiblings(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lists (Education / Career) and print Side */}
      <div className="lg:col-span-5 space-y-6">
        {/* Education History */}
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-500" /> Education Qualifications
            </h4>
            <button
              onClick={handleAddEducation}
              className="p-1 rounded bg-brand-50 dark:bg-brand-950/40 text-brand-600 transition-all text-xs font-bold flex items-center"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {education.map((edu, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                <div className="grid grid-cols-2 gap-2 flex-grow">
                  <input
                    type="text"
                    placeholder="Degree/Class"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx].degree = e.target.value;
                      setEducation(updated);
                    }}
                    className="px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded text-[11px] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="School/University"
                    value={edu.school}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx].school = e.target.value;
                      setEducation(updated);
                    }}
                    className="px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded text-[11px] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx].year = e.target.value;
                      setEducation(updated);
                    }}
                    className="px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded text-[11px] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Grade / %"
                    value={edu.percentage}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx].percentage = e.target.value;
                      setEducation(updated);
                    }}
                    className="px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded text-[11px] focus:outline-none"
                  />
                </div>
                {education.length > 1 && (
                  <button onClick={() => handleRemoveEducation(idx)} className="text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience history (Resume template only) */}
        {template === "resume" && (
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-brand-500" /> Work Experience
              </h4>
              <button
                onClick={handleAddExperience}
                className="p-1 rounded bg-brand-50 dark:bg-brand-950/40 text-brand-600 transition-all text-xs font-bold flex items-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Position #{idx + 1}</span>
                    {experience.length > 1 && (
                      <button onClick={() => handleRemoveExperience(idx)} className="text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].role = e.target.value;
                        setExperience(updated);
                      }}
                      className="px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded text-[11px] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].company = e.target.value;
                        setExperience(updated);
                      }}
                      className="px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded text-[11px] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Duration (e.g. 2 Years)"
                      value={exp.duration}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].duration = e.target.value;
                        setExperience(updated);
                      }}
                      className="px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded text-[11px] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Brief details of duties"
                      value={exp.details}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].details = e.target.value;
                        setExperience(updated);
                      }}
                      className="px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded text-[11px] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate / Print PDF card */}
        <div className="utility-card p-6 rounded-3xl border shadow-sm text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-350 dark:text-slate-700 mx-auto" />
          <h4 className="text-sm font-extrabold text-slate-850 dark:text-white">Ready to Export</h4>
          <p className="text-[11px] text-slate-450 max-w-xs mx-auto leading-relaxed">
            Generates standard A4 PDF files. Fully compliant, with clean formatting layout blocks.
          </p>

          <Button
            onClick={handleGeneratePdf}
            disabled={generating}
            className="w-full py-3 flex items-center justify-center gap-1.5"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Rendering Document...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download Vector PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
