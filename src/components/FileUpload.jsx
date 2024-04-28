import { FileUploader, Button } from '@ui5/webcomponents-react';

export default function FileUpload({ handleFileUpload }) {
  return (
    <FileUploader style={{ marginTop: '1rem' }} onChange={handleFileUpload} hideInput={true}>
      <Button>Upload single file</Button>
    </FileUploader>
  );
}
