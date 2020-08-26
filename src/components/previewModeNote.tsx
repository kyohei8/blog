import Link from 'next/link';
import * as React from 'react';

interface PreviewModeNoteProps {
  clearHref: string;
}

/**
 * PreviewModeNote
 */
const PreviewModeNote: React.FC<PreviewModeNoteProps> = ({ clearHref }) => (
  <div className="my-4">
    <div className="py-2 px-4 bg-yellow-300 rounded shadow-sm flex justify-between">
      <span>
        <b>Note: </b>Viewing in preview mode
      </span>
      <Link href={clearHref}>
        <button className="ml-1 px-2 text-blue-500">Exit Preview</button>
      </Link>
    </div>
  </div>
);
export default PreviewModeNote;
