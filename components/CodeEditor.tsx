"use client";

import { useMonaco } from "@monaco-editor/react";
import React, { useEffect, useRef, useState } from "react";

export interface EditorInstance {
  id: number;
  label: string;
  content: string;
}

export interface MonacoEditorWithTabsProps {
  generatedFormCode: EditorInstance[];
}

const MonacoEditorWithTabs: React.FC<MonacoEditorWithTabsProps> = ({
  generatedFormCode,
}) => {
  const monaco = useMonaco();
  const [editorInstances, setEditorInstances] = useState();

  const containerRefs = useRef([]);
  containerRefs.current = editorInstances?.map(() => React.createRef());

  useEffect(() => {
    console.log("editorInstances changed", editorInstances);
    editorInstances?.forEach((instance, index) => {
      if (!instance.editor) {
        const newEditor = monaco?.editor.create(
          containerRefs.current[index].current,
          {
            value: instance.content,
            language: "markdown",
            theme: "vs-dark",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }
        );

        setEditorInstances((prevInstances) => {
          const newInstances = [...prevInstances];
          newInstances[index] = { ...instance, editor: newEditor };
          return newInstances;
        });
      }
    });
  }, [monaco, editorInstances]);

  useEffect(() => {
    setEditorInstances(generatedFormCode);
  }, [generatedFormCode]);

  return (
    <div className="w-full">
      {editorInstances?.map((instance, index) => (
        <div className="mt-2 mb-2" key={instance.id}>
          <div>{instance.label}</div>
          <div
            className="max-h-96 overflow-y-auto space-y-10 my-10"
            ref={containerRefs.current[index]}
            style={{ height: "250px", width: "100%" }}
          />
        </div>
      ))}
    </div>
  );
};

export default MonacoEditorWithTabs;
