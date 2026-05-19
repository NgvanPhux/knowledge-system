import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

import courses from "../data/courses.json";

export default function Home() {

  return (
    <Layout title="Knowledge System">

      <main
        style={{
          padding: "40px",
        }}
      >

        {/* HERO */}
        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <h1>Kiến thưc của VanPhuc</h1>

          <p>
            Hệ thống lưu trữ kiến thức
          </p>

          {/* LINK MODULE NOTE */}
          <Link
            to="/notes"
            className="button button--primary"
          >
            Open Module Notes
          </Link>

        </div>

        {/* COURSE LIST */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(300px,1fr))",
            gap: "20px",
          }}
        >

          {courses.map((course, index) => (

            <div
              key={index}
              style={{
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "20px",
              }}
            >

              <h2>{course.title}</h2>

              <p>{course.description}</p>

              <Link
                className="button button--secondary"
                to={course.link}
              >
                Open Course
              </Link>

            </div>

          ))}

        </div>

      </main>

    </Layout>
  );
}