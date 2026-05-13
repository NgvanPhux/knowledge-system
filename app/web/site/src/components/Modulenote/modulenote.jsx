import React from "react";

import "./modulenote.css";

import useProjects from "../../hooks/useProjects";

import Header from "./Header";
import ProjectTabs from "./ProjectTabs";
import Sidebar from "./Sidebar";
import Workspace from "./Workspace";
import TemplateModal from "./TemplateModal";

export default function ModuleNote() {

  const {

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

  } = useProjects();

  return (
    <div className="module-note-app">
      <input
        type="file"
        accept=".json"
        ref={templateInputRef}
        style={{ display: "none" }}
        onChange={handleTemplateImport}
      />
      <input
        type="file"
        accept=".json"
        ref={projectInputRef}
        style={{ display: "none" }}
        onChange={handleProjectImport}
      />
      <Header
        newProject={newProject}
        deleteCurrentProject={deleteCurrentProject}
        renameCurrentProject={renameCurrentProject}
        exportWorkData={exportWorkData}
        importProjectData={importProjectData}
        exportProjectData={exportProjectData}
        projectInputRef={projectInputRef}
        handleProjectImport={handleProjectImport}
      />

      <ProjectTabs
        projects={projects}
        currentProjectId={currentProjectId}
        switchProject={switchProject}
      />

      <main className="container">

        <Sidebar
          currentProject={currentProject}
          createNewTemplate={createNewTemplate}
          exportTemplates={exportTemplates}
          importTemplates={importTemplates}
          openTemplateModal={openTemplateModal}
          templateInputRef={templateInputRef}
          handleTemplateImport={handleTemplateImport}
          handleDragTemplate={handleDragTemplate}
        />

        <Workspace
          currentProject={currentProject}
          handleDrop={handleDrop}
          updateLayerContent={updateLayerContent}
        />

      </main>

      <TemplateModal
        editingTemplate={editingTemplate}
        closeTemplateModal={closeTemplateModal}
        saveTemplateEdit={saveTemplateEdit}
        deleteTemplateCurrent={deleteTemplateCurrent}
      />

    </div>
  );
}