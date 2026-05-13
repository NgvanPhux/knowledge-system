export default function ProjectTabs({
  projects = [],
  currentProjectId,
  switchProject
}) {

  return (
    <div className="project-tabs">

      {projects.map(project => (

        <div
          key={project.id}
          className={
            project.id === currentProjectId
              ? "tab-item active"
              : "tab-item"
          }
          onClick={() =>
            switchProject(project.id)
          }
        >
          {project.name}
        </div>

      ))}

    </div>
  );
}