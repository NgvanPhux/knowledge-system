import React, { useEffect, useState } from "react";

export default function TemplateModal({
  editingTemplate,
  closeTemplateModal,
  saveTemplateEdit,
  deleteTemplateCurrent
}) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {

    if (editingTemplate) {

      setTitle(editingTemplate.title || "");
      setContent(
        editingTemplate.defaultContent || ""
      );
    }

  }, [editingTemplate]);

  if (!editingTemplate) return null;

  return (
    <div className="modal">

      <div className="modal-content">

        <span
          className="close"
          onClick={closeTemplateModal}
        >
          ×
        </span>

        <h3>Chỉnh sửa Module Gốc</h3>

        <label>Tên hiển thị:</label>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <label>
          Nội dung mặc định:
        </label>

        <textarea
          rows="10"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        <div className="modal-actions">

          <button
            className="btn-delete"
            onClick={
              deleteTemplateCurrent
            }
          >
            Xóa Module
          </button>

          <button
            className="btn-save"
            onClick={() =>
              saveTemplateEdit({
                title,
                defaultContent: content
              })
            }
          >
            Lưu thay đổi
          </button>

        </div>

      </div>

    </div>
  );
}