import React from "react";

export default function Header({

  newProject,
  deleteCurrentProject,
  renameCurrentProject,

  exportWorkData,
  importProjectData,
  exportProjectData,

  projectInputRef,
  handleProjectImport

}) {

  return (
    <header>

      <div className="brand">
        Multi-Project App
      </div>

      <div className="header-actions">

        <button
          onClick={newProject}
          className="btn-action btn-new"
        >
          ➕ New Project
        </button>

        <button
          onClick={deleteCurrentProject}
          className="btn-action btn-delete"
        >
          🗑️ Delete Project
        </button>

        <button
          onClick={renameCurrentProject}
          className="btn-action btn-rename"
        >
          ✏️ Rename Project
        </button>

        <span className="divider">|</span>

        <button
          onClick={exportWorkData}
          className="btn-export word"
        >
          📄 Xuất Word/Txt
        </button>

        <button
          className="btn-load"
          onClick={importProjectData}
        >
          📂 Nạp Công việc
        </button>

        <button
          onClick={exportProjectData}
          className="btn-save"
        >
          💾 Backup Project
        </button>

        <input
          type="file"
          ref={projectInputRef}
          accept=".json"
          style={{ display: "none" }}
          onChange={handleProjectImport}
        />

      </div>

    </header>
  );
}