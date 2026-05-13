import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "multiProjectData_v4";

function useProjects() {

  const projectInputRef = useRef(null);
  const templateInputRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const [editingTemplate, setEditingTemplate] =
    useState(null);

  // =====================================================
  // INIT
  // =====================================================

  useEffect(() => {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

      const parsed = JSON.parse(saved);

      setProjects(parsed.projects || []);
      setCurrentProjectId(parsed.currentProjectId);

    } else {

      const firstProject = createProject(
        "Project 1"
      );

      setProjects([firstProject]);
      setCurrentProjectId(firstProject.id);
    }

  }, []);

  // =====================================================
  // SAVE
  // =====================================================

  useEffect(() => {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        projects,
        currentProjectId
      })
    );

  }, [projects, currentProjectId]);

  // =====================================================
  // HELPERS
  // =====================================================

  function uid(prefix = "id") {
    return prefix + "_" + Date.now();
  }

  function createProject(name) {

    return {
      id: uid("proj"),
      name,
      templates: [
        {
          id: uid("tpl"),
          title: "Tiêu đề Mới",
          defaultContent: "Nội dung..."
        }
      ],
      workData: []
    };
  }

  const currentProject =

    projects.find(
      p => p.id === currentProjectId
    )

    ||

    {
      templates: [],
      workData: []
    };

  function updateCurrentProject(data) {

    setProjects(prev =>
      prev.map(p =>
        p.id === currentProjectId
          ? { ...p, ...data }
          : p
      )
    );
  }

  // =====================================================
  // PROJECT
  // =====================================================

  function newProject() {

    const newProj = createProject(
      `Project ${projects.length + 1}`
    );

    setProjects(prev => [...prev, newProj]);

    setCurrentProjectId(newProj.id);
  }

  function switchProject(id) {
    setCurrentProjectId(id);
  }

  function deleteCurrentProject() {

    if (!currentProject) return;

    if (
      !window.confirm(
        `Xóa ${currentProject.name}?`
      )
    ) return;

    const filtered = projects.filter(
      p => p.id !== currentProject.id
    );

    setProjects(filtered);

    if (filtered.length > 0) {
      setCurrentProjectId(filtered[0].id);
    } else {
      const first = createProject("Project 1");

      setProjects([first]);
      setCurrentProjectId(first.id);
    }
  }

  function renameCurrentProject() {

    if (!currentProject) return;

    const name = prompt(
      "Tên mới:",
      currentProject.name
    );

    if (!name) return;

    updateCurrentProject({
      name
    });
  }

  // =====================================================
  // TEMPLATE
  // =====================================================

  function createNewTemplate() {

    if (!currentProject) return;

    const newTpl = {
      id: uid("tpl"),
      title: "Module Mới",
      defaultContent: "Nội dung mẫu..."
    };

    updateCurrentProject({
      templates: [
        ...currentProject.templates,
        newTpl
      ]
    });
  }

  function openTemplateModal(tpl) {
    setEditingTemplate(tpl);
  }

  function closeTemplateModal() {
    setEditingTemplate(null);
  }

  function saveTemplateEdit(data) {

    const updated =
      currentProject.templates.map(t =>
        t.id === editingTemplate.id
          ? {
              ...t,
              ...data
            }
          : t
      );

    updateCurrentProject({
      templates: updated
    });

    closeTemplateModal();
  }

  function deleteTemplateCurrent() {

    if (!editingTemplate) return;

    const updated =
      currentProject.templates.filter(
        t => t.id !== editingTemplate.id
      );

    updateCurrentProject({
      templates: updated
    });

    closeTemplateModal();
  }

  // =====================================================
  // DRAG DROP
  // =====================================================

  function handleDragTemplate(e, tplId) {

    e.dataTransfer.setData(
      "tplId",
      tplId
    );
  }

  function handleDrop(e) {

    e.preventDefault();

    if (!currentProject) return;

    const tplId =
      e.dataTransfer.getData("tplId");

    if (!tplId) return;

    const tpl =
      currentProject.templates.find(
        t => t.id === tplId
      );

    if (!tpl) return;

    const newLayer = {

      instanceId: uid("layer"),

      title: tpl.title,

      content:
        tpl.defaultContent || ""
    };

    updateCurrentProject({

      workData: [
        ...(currentProject.workData || []),
        newLayer
      ]
    });
  }

  // =====================================================
  // WORKSPACE
  // =====================================================

  function updateLayerContent(
    index,
    content
  ) {

    const updated = [
      ...currentProject.workData
    ];

    updated[index].content = content;

    updateCurrentProject({
      workData: updated
    });
  }

  // =====================================================
  // EXPORT TXT / WORD
  // =====================================================

  function exportWorkData() {

    if (
      !currentProject ||
      currentProject.workData.length === 0
    ) {
      alert("Không có dữ liệu");
      return;
    }

    const type = prompt(
      "1 = Word, 2 = Txt",
      "2"
    );

    // WORD

    if (type === "1") {

      let html = `
        <html>
        <head>
        <meta charset="utf-8">
        </head>
        <body>
      `;

      currentProject.workData.forEach(
        item => {

          html += `
            <h2>${item.title}</h2>
            <div>${item.content}</div>
            <br/>
          `;
        }
      );

      html += "</body></html>";

      const blob = new Blob(
        [html],
        {
          type:
            "application/msword"
        }
      );

      downloadBlob(
        blob,
        `${currentProject.name}.doc`
      );
    }

    // TXT

    else {

      let txt = "";

      currentProject.workData.forEach(
        item => {

          const div =
            document.createElement("div");

          div.innerHTML = item.content;

          txt += `
${item.title}

${div.innerText}

`;
        }
      );

      const blob = new Blob(
        [txt],
        {
          type: "text/plain"
        }
      );

      downloadBlob(
        blob,
        `${currentProject.name}.txt`
      );
    }
  }

  // =====================================================
  // EXPORT PROJECT
  // =====================================================

  function exportProjectData() {

    if (!currentProject) return;

    const blob = new Blob(
      [
        JSON.stringify(
          currentProject,
          null,
          2
        )
      ],
      {
        type: "application/json"
      }
    );

    downloadBlob(
      blob,
      `${currentProject.name}.json`
    );
  }

  // =====================================================
  // IMPORT PROJECT
  // =====================================================

  function importProjectData() {

    projectInputRef.current.click();
  }

  function handleProjectImport(e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = ev => {

      try {

        const json = JSON.parse(
          ev.target.result
        );

        const imported = {

        ...json,

        id: uid("proj"),

        templates: json.templates || [],

        workData: json.workData || []
      };

        setProjects(prev => [
          ...prev,
          imported
        ]);

        setCurrentProjectId(
          imported.id
        );

        alert("Import thành công");

      } catch (err) {

        alert("JSON lỗi");
      }
    };

    reader.readAsText(file);
  }

  // =====================================================
  // TEMPLATE EXPORT
  // =====================================================

  function exportTemplates() {

    const blob = new Blob(
      [
        JSON.stringify(
          currentProject.templates,
          null,
          2
        )
      ],
      {
        type: "application/json"
      }
    );

    downloadBlob(
      blob,
      `${currentProject.name}_templates.json`
    );
  }

  function importTemplates() {

    templateInputRef.current.click();
  }

  function handleTemplateImport(e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = ev => {

      try {

        const templates = JSON.parse(
          ev.target.result
        );

        updateCurrentProject({
          templates
        });

        alert(
          "Import template thành công"
        );

      } catch {

        alert("JSON lỗi");
      }
    };

    reader.readAsText(file);
  }

  // =====================================================
  // DOWNLOAD
  // =====================================================

  function downloadBlob(blob, filename) {

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = filename;

    a.click();

    URL.revokeObjectURL(url);
  }

  // =====================================================
  // RETURN
  // =====================================================

  return {

    projects,
    currentProject,
    currentProjectId,

    projectInputRef,
    templateInputRef,

    editingTemplate,

    newProject,
    switchProject,
    deleteCurrentProject,
    renameCurrentProject,

    createNewTemplate,

    openTemplateModal,
    closeTemplateModal,
    saveTemplateEdit,
    deleteTemplateCurrent,

    handleDragTemplate,
    handleDrop,

    updateLayerContent,

    exportWorkData,
    exportProjectData,
    importProjectData,
    handleProjectImport,

    exportTemplates,
    importTemplates,
    handleTemplateImport
  };

}
  export default useProjects;