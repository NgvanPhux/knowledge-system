import pandas as pd
import os
import re
import json

# =========================================================
# BASE PATH
# =========================================================
BASE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../")
)

EXCEL_FOLDER = os.path.join(BASE_PATH, "data/excel")
DOCS_OUTPUT = os.path.join(BASE_PATH, "app/web/site/docs/courses")
JSON_OUTPUT = os.path.join(BASE_PATH, "app/web/site/src/data/courses.json")

os.makedirs(DOCS_OUTPUT, exist_ok=True)
os.makedirs(os.path.dirname(JSON_OUTPUT), exist_ok=True)

# =========================================================
# GET EXCEL FILES
# =========================================================
excel_files = [
    f for f in os.listdir(EXCEL_FOLDER)
    if f.endswith(".xlsx") and not f.startswith("~$")
]

print("📂 Tìm thấy files:", excel_files)

# =========================================================
# SLUGIFY - CẢI TIẾN
# =========================================================
def slugify(text):
    if not text or pd.isna(text):
        return "khong-ten"

    text = str(text).strip().lower()

    replace_map = {
        "à":"a","á":"a","ạ":"a","ả":"a","ã":"a",
        "â":"a","ầ":"a","ấ":"a","ậ":"a","ẩ":"a","ẫ":"a",
        "ă":"a","ằ":"a","ắ":"a","ặ":"a","ẳ":"a","ẵ":"a",
        "è":"e","é":"e","ẹ":"e","ẻ":"e","ẽ":"e",
        "ê":"e","ề":"e","ế":"e","ệ":"e","ể":"e","ễ":"e",
        "ì":"i","í":"i","ị":"i","ỉ":"i","ĩ":"i",
        "ò":"o","ó":"o","ọ":"o","ỏ":"o","õ":"o",
        "ô":"o","ồ":"o","ố":"o","ộ":"o","ổ":"o","ỗ":"o",
        "ơ":"o","ờ":"o","ớ":"o","ợ":"o","ở":"o","ỡ":"o",
        "ù":"u","ú":"u","ụ":"u","ủ":"u","ũ":"u",
        "ư":"u","ừ":"u","ứ":"u","ự":"u","ử":"u","ữ":"u",
        "ỳ":"y","ý":"y","ỵ":"y","ỷ":"y","ỹ":"y",
        "đ":"d"
    }

    for k, v in replace_map.items():
        text = text.replace(k, v)

    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "khong-ten"


# =========================================================
# MAIN PROCESS
# =========================================================
generated_files = []
courses_data = []

for excel_file in excel_files:
    file_path = os.path.join(EXCEL_FOLDER, excel_file)
    print(f"\n📄 Đang xử lý: {excel_file}")

    df = pd.read_excel(file_path, engine="openpyxl")

    # Clean columns
    df.columns = [str(c).strip().lower() for c in df.columns]

    required_columns = ["course", "lession", "order", "type", "content", "media"]
    for col in required_columns:
        if col not in df.columns:
            raise Exception(f"❌ Thiếu cột: {col} trong file {excel_file}")

    # Get course name
    course_name = str(df.iloc[0]["course"]).strip()
    if not course_name or course_name.lower() in ['nan', 'none']:
        print(f"⚠️ Bỏ qua file vì không có tên khóa học: {excel_file}")
        continue

    course_slug = slugify(course_name)
    output_course_folder = os.path.join(DOCS_OUTPUT, course_slug)
    os.makedirs(output_course_folder, exist_ok=True)

    first_lesson = None

    # Group by lesson
    grouped = df.groupby("lession")

    for lession_name, rows in grouped:
        rows = rows.sort_values("order")
        lesson_slug = slugify(lession_name)

        if first_lesson is None:
            first_lesson = lesson_slug

        mdx = f"""---
title: "{lession_name}"
---

# {lession_name}

"""

        for _, row in rows.iterrows():
            item_type = str(row["type"]).strip().lower()
            content = str(row["content"]).strip() if pd.notna(row["content"]) else ""
            media = str(row["media"]).strip() if pd.notna(row["media"]) else ""

            if item_type == "heading":
                mdx += f"\n## {content}\n\n"
            elif item_type == "text":
                mdx += f"{content}\n\n"
            elif item_type == "image" and media:
                mdx += f'<img src="{media}" width="900" alt="{content}" />\n\n'
            elif item_type == "video" and media:
                mdx += f'<video controls width="900">\n  <source src="{media}" type="video/mp4" />\n</video>\n\n'
            elif item_type == "youtube" and media:
                embed = media.replace("watch?v=", "embed/")
                mdx += f"""
<iframe width="100%" height="500" src="{embed}" 
        title="YouTube video player" frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen></iframe>\n\n"""
            elif item_type == "pdf" and media:
                mdx += f'<a href="{media}" target="_blank">📄 {content}</a>\n\n'
            elif item_type == "code" and content:
                mdx += f"```python\n{content}\n```\n\n"
            elif item_type == "note" and content:
                mdx += f"> ⚠️ {content}\n\n"

        # Write file
        file_output = os.path.join(output_course_folder, f"{lesson_slug}.mdx")
        with open(file_output, "w", encoding="utf-8") as f:
            f.write(mdx)

        generated_files.append(os.path.abspath(file_output))
        print(f"   ✅ Đã tạo: {lesson_slug}.mdx")

    # Add to courses list
    if first_lesson:
        courses_data.append({
            "title": course_name,
            "slug": course_slug,
            "description": f"Khóa học {course_name}",
            "link": f"/courses/{course_slug}/{first_lesson}"
        })

# =========================================================
# CLEAN OLD FILES
# =========================================================
for root, dirs, files in os.walk(DOCS_OUTPUT):
    for file in files:
        if file.endswith(".mdx"):
            full_path = os.path.abspath(os.path.join(root, file))
            if full_path not in generated_files:
                os.remove(full_path)
                print(f"🗑 Đã xóa file cũ: {file}")

# =========================================================
# WRITE COURSES.JSON
# =========================================================
with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
    json.dump(courses_data, f, ensure_ascii=False, indent=2)

print("\n🎉 HOÀN THÀNH!")
print(f"📊 Tổng số khóa học: {len(courses_data)}")
print(f"💾 courses.json đã được cập nhật tại: {JSON_OUTPUT}")