import React from 'react';
import {
  Talk2DataAstVisual,
  Talk2DataMcpVisual,
  Talk2DataStudioUI,
} from './Talk2DataVisuals.tsx';
import {
  SpecExecAstVisual,
  SpecExecBenchVisual,
  SpecExecRuntimeUI,
} from './SpecExecVisuals.tsx';
import {
  DuetDomOverlayVisual,
  DuetExportPipeVisual,
  DuetReviewStudioUI,
} from './DuetVisuals.tsx';

export type ProjectVisualSlotType = 'col1Top' | 'col1Bottom' | 'col2Main';

interface ProjectVisualSlotProps {
  projectId: string;
  slot: ProjectVisualSlotType;
}

export const ProjectVisualSlot: React.FC<ProjectVisualSlotProps> = ({ projectId, slot }) => {
  if (projectId === '01') {
    if (slot === 'col1Top') return <Talk2DataAstVisual />;
    if (slot === 'col1Bottom') return <Talk2DataMcpVisual />;
    return <Talk2DataStudioUI />;
  }

  if (projectId === '02') {
    if (slot === 'col1Top') return <SpecExecAstVisual />;
    if (slot === 'col1Bottom') return <SpecExecBenchVisual />;
    return <SpecExecRuntimeUI />;
  }

  if (projectId === '03') {
    if (slot === 'col1Top') return <DuetDomOverlayVisual />;
    if (slot === 'col1Bottom') return <DuetExportPipeVisual />;
    return <DuetReviewStudioUI />;
  }

  return (
    <div className="w-full h-full bg-[#141414] flex items-center justify-center text-xs text-white/40 font-mono">
      Architecture Schematic
    </div>
  );
};
