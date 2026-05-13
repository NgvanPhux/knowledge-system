import React from "react";

import { useProjects }
from "../../hooks/useProjects";

import Header from "./Header";
import ProjectTabs from "./ProjectTabs";
import Sidebar from "./Sidebar";
import Workspace from "./Workspace";
import TemplateModal from "./TemplateModal";

import "./modulenote.css";

export default function App() {

  const app = useProjects();

  return (

    <div className="module-note-app">

      {/* HEADER */}

      <Header
        newProject={app.newProject}
        deleteCurrentProject={
          app.deleteCurrentProject
        }
        renameCurrentProject={
          app.renameCurrentProject
        }
        exportWorkData={
          app.exportWorkData
        }
        importProjectData={
          app.importProjectData
        }
        exportProjectData={
          app.exportProjectData
        }
      />

      {/* PROJECT TABS */}

      <ProjectTabs
        projects={app.projects}
        currentProjectId={
          app.currentProjectId
        }
        switchProject={
          app.switchProject
        }
      />

      {/* MAIN */}

      <main className="container">

        {/* SIDEBAR */}

        <Sidebar
          currentProject={
            app.currentProject
          }

          createNewTemplate={
            app.createNewTemplate
          }

          openTemplateModal={
            app.openTemplateModal
          }

          exportTemplates={
            app.exportTemplates
          }

          importTemplates={
            app.importTemplates
          }

          handleDragTemplate={
            app.handleDragTemplate
          }
        />

        {/* WORKSPACE */}

        <Workspace
          currentProject={
            app.currentProject
          }

          handleDrop={
            app.handleDrop
          }

          updateLayerContent={
            app.updateLayerContent
          }
        />

      </main>

      {/* FILE INPUTS */}

      <input
        type="file"
        ref={app.projectInputRef}
        accept=".json"
        style={{ display: "none" }}
        onChange={
          app.handleProjectImport
        }
      />

      <input
        type="file"
        ref={app.templateInputRef}
        accept=".json"
        style={{ display: "none" }}
        onChange={
          app.handleTemplateImport
        }
      />

      {/* MODAL */}

      <TemplateModal
        editingTemplate={
          app.editingTemplate
        }

        closeTemplateModal={
          app.closeTemplateModal
        }

        saveTemplateEdit={
          app.saveTemplateEdit
        }

        deleteTemplateCurrent={
          app.deleteTemplateCurrent
        }
      />

    </div>
  );
}