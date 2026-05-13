import time
import subprocess
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

EXCEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/excel"))

class ExcelHandler(FileSystemEventHandler):

    def on_modified(self, event):
        if event.src_path.endswith(".xlsx") and not "~$" in event.src_path:
            print("📊 Excel changed:", event.src_path)

            # chạy script build
            subprocess.run(["python", "excel_to_docs.py"])

            print("✅ Docs updated\n")


if __name__ == "__main__":
    observer = Observer()
    handler = ExcelHandler()

    observer.schedule(handler, EXCEL_PATH, recursive=False)
    observer.start()

    print("👀 Watching Excel folder...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()