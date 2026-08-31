"use client";
import React, { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, ScratchpadNote } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { FileText, Plus, Trash2, Edit2, Copy, Download, Check, Eye, Code, Save } from "lucide-react";

export default function Scratchpad() {
  const notes = useLiveQuery(() => db.scratchpads.orderBy("updatedAt").reverse().toArray());
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState<string>("");
  const [editTitleId, setEditTitleId] = useState<number | null>(null);
  const [titleInput, setTitleInput] = useState<string>("");
  
  const [copied, setCopied] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview" | "split">("split");

  // Seeding initial note if database is empty
  useEffect(() => {
    if (notes && notes.length === 0) {
      db.scratchpads.add({
        title: "Quick Notes",
        content: `# Welcome to OmniKits Scratchpad!

This is a local, persistent Markdown notepad. Everything you type here is saved to your browser's **IndexedDB** database on every keystroke. 

### Features
- **Auto-Save**: Run page refreshes or close tabs; no data is lost.
- **Multiple Notes**: Use the tabs below to organize different scratchpads.
- **Markdown Render**: Supports headings, **bold**, *italics*, code, quotes, and bullet items.

Try typing some notes here!
- Item 1
- Item 2

> This is a quote block.
`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }, [notes]);

  // Set initial active note
  useEffect(() => {
    if (notes && notes.length > 0 && activeNoteId === null) {
      setActiveNoteId(notes[0].id || null);
      setNoteContent(notes[0].content);
    }
  }, [notes, activeNoteId]);

  // Sync content when active note changes
  const activeNote = notes?.find((n) => n.id === activeNoteId);
  useEffect(() => {
    if (activeNote) {
      setNoteContent(activeNote.content);
    }
  }, [activeNoteId, activeNote]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteContent(val);
    if (activeNoteId !== null) {
      db.scratchpads.update(activeNoteId, {
        content: val,
        updatedAt: Date.now(),
      });
    }
  };

  const handleAddNote = async () => {
    const newId = await db.scratchpads.add({
      title: `Note #${(notes?.length || 0) + 1}`,
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setActiveNoteId(newId);
  };

  const handleDeleteNote = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this scratchpad note?")) {
      await db.scratchpads.delete(id);
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
    }
  };

  const handleStartRename = (note: ScratchpadNote, e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.id) {
      setEditTitleId(note.id);
      setTitleInput(note.title);
    }
  };

  const handleSaveRename = async (id: number) => {
    if (titleInput.trim()) {
      await db.scratchpads.update(id, {
        title: titleInput.trim(),
        updatedAt: Date.now(),
      });
    }
    setEditTitleId(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(noteContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeNote) return;
    const blob = new Blob([noteContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNote.title.toLowerCase().replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Client-Side Regex Markdown Parser
  const parseMarkdown = (md: string) => {
    if (!md) return "";
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h5 class="text-sm font-extrabold text-slate-800 dark:text-white mt-4 mb-2">$1</h5>');
    html = html.replace(/^## (.*$)/gim, '<h4 class="text-base font-black text-slate-900 dark:text-white mt-5 mb-2.5">$1</h4>');
    html = html.replace(/^# (.*$)/gim, '<h3 class="text-lg font-black text-slate-950 dark:text-white mt-6 mb-3 border-b border-slate-100 dark:border-slate-800 pb-1">$1</h3>');

    // Bold & Italics
    html = html.replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>");
    html = html.replace(/\*(.*)\*/gim, "<em>$1</em>");

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-brand-500 pl-4 py-1 italic bg-slate-50 dark:bg-slate-950 rounded">$1</blockquote>');

    // Code blocks
    html = html.replace(/\`\`\`([\s\S]*?)\`\`\`/gim, '<pre class="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-auto my-3">$1</pre>');
    html = html.replace(/\`(.*?)\`/gim, '<code class="bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded text-brand-600 dark:text-brand-400 font-mono text-xs">$1</code>');

    // Bullet lists
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-xs text-slate-600 dark:text-slate-400 my-1">$1</li>');

    // Paragraph splits
    html = html
      .split(/\n{2,}/g)
      .map((p) => {
        const trimmed = p.trim();
        if (
          trimmed.startsWith("<h") ||
          trimmed.startsWith("<blockquote") ||
          trimmed.startsWith("<pre") ||
          trimmed.startsWith("<li")
        ) {
          return p;
        }
        return `<p class="text-xs text-slate-650 dark:text-slate-350 leading-relaxed my-2">${p.replace(/\n/g, "<br>")}</p>`;
      })
      .join("\n");

    return html;
  };

  const renderedHtml = parseMarkdown(noteContent);
  const wordsCount = noteContent.trim() === "" ? 0 : noteContent.trim().split(/\s+/).filter((w) => w.length > 0).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar - Tabs List */}
      <div className="lg:col-span-3 space-y-4">
        <div className="utility-card p-4 rounded-3xl border shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Scratchpad Tabs
            </span>
            <button
              onClick={handleAddNote}
              className="p-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/40 text-brand-600 transition-colors"
              title="Add New Note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
            {notes?.map((note) => {
              const isActive = note.id === activeNoteId;
              const isRenaming = note.id === editTitleId;
              return (
                <div
                  key={note.id}
                  onClick={() => note.id && setActiveNoteId(note.id)}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none shrink-0 lg:shrink ${
                    isActive
                      ? "bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 font-bold border border-brand-100 dark:border-brand-900/40"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 border border-transparent"
                  }`}
                >
                  {isRenaming ? (
                    <input
                      type="text"
                      value={titleInput}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setTitleInput(e.target.value)}
                      onBlur={() => note.id && handleSaveRename(note.id)}
                      onKeyDown={(e) => e.key === "Enter" && note.id && handleSaveRename(note.id)}
                      className="px-1.5 py-0.5 border rounded border-brand-300 bg-transparent text-xs w-28 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs truncate max-w-[120px]">{note.title}</span>
                  )}

                  <div className="flex gap-1 shrink-0">
                    {!isRenaming && (
                      <button
                        onClick={(e) => handleStartRename(note, e)}
                        className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}
                    {notes && notes.length > 1 && (
                      <button
                        onClick={(e) => note.id && handleDeleteNote(note.id, e)}
                        className="p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor & Preview Pane Side */}
      <div className="lg:col-span-9 space-y-4">
        {activeNoteId !== null && activeNote ? (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-3 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-850">
                <button
                  onClick={() => setPreviewMode("edit")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                    previewMode === "edit"
                      ? "bg-white dark:bg-slate-900 text-brand-650 dark:text-brand-400 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" /> Editor
                </button>
                <button
                  onClick={() => setPreviewMode("split")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                    previewMode === "split"
                      ? "bg-white dark:bg-slate-900 text-brand-650 dark:text-brand-400 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Split View
                </button>
                <button
                  onClick={() => setPreviewMode("preview")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                    previewMode === "preview"
                      ? "bg-white dark:bg-slate-900 text-brand-650 dark:text-brand-400 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>

              <div className="flex gap-2">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 border border-slate-100 dark:border-slate-800 rounded-lg px-2 bg-slate-50/50 dark:bg-slate-950/20 select-none">
                  <Save className="w-3 h-3 text-brand-500" /> Auto-Saved
                </span>
                
                <button
                  onClick={handleCopy}
                  className="text-xs font-semibold text-slate-550 border border-slate-200 dark:border-slate-800 hover:border-brand-500 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Text
                </button>
                
                <button
                  onClick={handleDownload}
                  className="text-xs font-semibold text-slate-550 border border-slate-200 dark:border-slate-800 hover:border-brand-500 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <Download className="w-3.5 h-3.5" /> Export TXT
                </button>
              </div>
            </div>

            {/* View Panes */}
            <div className="utility-card border rounded-3xl p-6 shadow-sm min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Editor textarea */}
                {(previewMode === "edit" || previewMode === "split") && (
                  <div className={`${previewMode === "split" ? "md:col-span-6 md:border-r border-slate-150 dark:border-slate-800/80 md:pr-6" : "md:col-span-12"}`}>
                    <textarea
                      value={noteContent}
                      onChange={handleTextChange}
                      placeholder="Start drafting notes or typing markdown here..."
                      rows={18}
                      className="w-full bg-transparent text-slate-800 dark:text-slate-200 leading-relaxed text-sm focus:outline-none resize-y placeholder:text-slate-400 dark:placeholder:text-slate-700 min-h-[400px] font-semibold"
                    />
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase border-t border-slate-100 dark:border-slate-800 pt-2.5 mt-2">
                      Words count: {wordsCount}
                    </div>
                  </div>
                )}

                {/* Markdown Preview HTML */}
                {(previewMode === "preview" || previewMode === "split") && (
                  <div
                    className={`${
                      previewMode === "split" ? "md:col-span-6" : "md:col-span-12"
                    } prose dark:prose-invert max-w-none overflow-y-auto max-h-[450px] pr-2`}
                  >
                    {noteContent ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: renderedHtml }}
                        className="space-y-2"
                      />
                    ) : (
                      <span className="text-slate-400 text-xs italic">Markdown preview empty...</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 border border-slate-200/50 dark:border-slate-850 rounded-3xl bg-white/30 dark:bg-slate-950/20">
            <FileText className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-800 mb-3 animate-pulse" />
            <p className="text-base font-bold text-slate-750 dark:text-slate-350">No note loaded</p>
            <p className="text-xs text-slate-400 mt-1">Please select an active note or add a new tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}
