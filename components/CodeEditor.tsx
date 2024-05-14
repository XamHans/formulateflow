import Editor, { useMonaco } from "@monaco-editor/react";
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../@/components/ui/tabs";

export interface EditorInstance {
  id: number;
  name: string; // Changed label to name
  content: string;
}

// export interface MonacoEditorWithTabsProps {
//   generatedFormCode: EditorInstance[];
// }

const MonacoEditorWithTabs: React.FC = () => {
  const monaco = useMonaco();
  const [editorInstances, setEditorInstances] = useState([
    {
      id: 0,
      label: "store.ts",
      content:
        "import { create } from 'zustand';\n\ninterface Onboa…tStep: (step) => set({ currentStep: step }),\n}));",
    },

    {
      id: 1,
      label: "WizardWrapper.tsx",
      content:
        "import React from 'react';\nimport { useOnboardingS…rStep()}</div>;\n};\n\nexport default WizardWrapper;",
    },

    {
      id: 2,
      label: "WizardPage.tsx",
      content:
        "import React from 'react';\nimport { useForm } from…>\n    </form>\n  );\n};\n\nexport default WizardPage;",
    },
    {
      id: 3,
      label: "WizardPage.tsx",
      content:
        "import React from 'react';\nimport { useForm } from…>\n    </form>\n  );\n};\n\nexport default WizardPage;",
    },
  ]);

  // useEffect(() => {
  //   setEditorInstances(generatedFormCode);
  // }, [generatedFormCode]);

  return (
    <div className="w-full">
      <Tabs defaultValue={editorInstances?.[0]?.label} className="w-full">
        <TabsList className=" w-full  flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-white ">
          {editorInstances?.map((instance) => (
            <TabsTrigger key={instance.id} value={instance.label}>
              {instance.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {editorInstances?.map((instance, index) => (
          <TabsContent
            key={instance.id}
            value={instance.label}
            className="w-full h-96"
          >
            <Editor
              className="w-full h-96"
              defaultLanguage="jsx"
              theme="vs-dark"
              defaultValue={instance.content}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MonacoEditorWithTabs;
