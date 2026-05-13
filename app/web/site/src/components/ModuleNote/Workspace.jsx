export default function Workspace({
  currentProject,
  handleDrop,
  updateLayerContent
}) {

  return (

    <section
      className="content-area"
      onDragOver={(e) => {

        e.preventDefault();

        e.dataTransfer.dropEffect =
          "copy";
      }}

      onDrop={(e) => {

        e.preventDefault();

        handleDrop(e);
      }}
    >

      <div className="work-space">

        {!currentProject ||
        (currentProject.workData || []).length === 0 ? (

          <p className="placeholder-text">
            Kéo thả module vào đây...
          </p>

        ) : (

          (currentProject.workData || []).map(
            (layer, index) => (

              <div
                key={layer.instanceId}
                className="content-row"
              >

                <div className="layer-info">

                  <div className="layer-title">
                    {layer.title}
                  </div>

                  <div className="layer-action-hint">
                    Double Click: Sửa tên
                    <br />
                    Right Click: Xóa
                  </div>

                </div>

                <div
                  className="editor-area"
                  contentEditable
                  suppressContentEditableWarning
                  dangerouslySetInnerHTML={{
                    __html: layer.content
                  }}
                  onInput={(e) =>
                    updateLayerContent(
                      index,
                      e.currentTarget.innerHTML
                    )
                  }
                />

              </div>
            )
          )

        )}

      </div>

    </section>
  );
}