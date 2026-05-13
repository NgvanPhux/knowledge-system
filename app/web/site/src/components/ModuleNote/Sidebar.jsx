import React from "react";

export default function Sidebar({
  currentProject,
  createNewTemplate,
  exportTemplates,
  importTemplates,
  openTemplateModal,
}) {

  if (!currentProject) {

    return (
      <aside className="sidebar">
        <h3 id="sidebar-title">
          Modules: Chưa có Project
        </h3>
      </aside>
    );
  }

  return (

    <aside className="sidebar">

      <h3 id="sidebar-title">
        Modules: {currentProject.name}
      </h3>

      <div className="template-actions">

        <button
          className="btn-action"
          onClick={exportTemplates}
        >
          Xuất Thư viện
        </button>

        <button
          className="btn-action"
          onClick={importTemplates}
        >
          Nạp Thư viện
        </button>

      </div>

      <p className="hint">
        - Kéo sang phải để dùng
        <br />
        - <b>Chuột phải</b> để sửa/xóa gốc
      </p>

      <div className="module-list">

        {currentProject.templates?.map((tpl) => (

          <div
            key={tpl.id}
            className="module-item"
            draggable

            onDragStart={(e) => {

              e.dataTransfer.setData(
                "tplId",
                tpl.id
              );

              e.dataTransfer.effectAllowed =
                "copy";
            }}

            onContextMenu={(e) => {

              e.preventDefault();

              openTemplateModal(tpl);
            }}
          >

            {tpl.title}

          </div>

        ))}

      </div>

      <button
        className="btn-add-module"
        onClick={createNewTemplate}
      >
        + Thêm Module Gốc
      </button>

    </aside>
  );
}