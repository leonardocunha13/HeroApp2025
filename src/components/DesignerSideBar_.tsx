import { Text } from '@aws-amplify/ui-react';
import DraggableItem from './DraggableItem'; // Adjust the path as needed

const components = [
  { name: 'TextField', label: 'Text Input' },
  { name: 'Checkbox', label: 'Checkbox' },
  { name: 'Select', label: 'Dropdown Select' },
  { name: 'DatePicker', label: 'Date Picker' },
  { name: 'Table', label: 'Table' },
  { name: 'Divider', label: 'Divider' },
  { name: 'Button', label: 'Button' },
  { name: 'Image', label: 'Image' },
  { name: 'TextArea', label: 'Text Area' },
  { name: 'RadioGroup', label: 'Radio Group' },
  { name: 'Map', label: 'Map' },
  { name: 'SignaturePad', label: 'Signature Pad' },
  { name: 'FileUpload', label: 'File Upload' },
  { name: 'RichTextEditor', label: 'Rich Text Editor' },
  { name: 'VideoPlayer', label: 'Video Player' },
  { name: 'AudioPlayer', label: 'Audio Player' },
  { name: 'ProgressBar', label: 'Progress Bar' },
  { name: 'Slider', label: 'Slider' },
  { name: 'ToggleSwitch', label: 'Toggle Switch' },
  { name: 'ColorPicker', label: 'Color Picker' },
  { name: 'QRScanner', label: 'QR Scanner' },
  { name: 'BarcodeScanner', label: 'Barcode Scanner' },
  { name: 'SignatureCapture', label: 'Signature Capture' },
  { name: 'LocationPicker', label: 'Location Picker' },
  { name: 'CameraCapture', label: 'Camera Capture' },
];

const DesignerSidebar = () => {
  return (
    <aside
      style={{
        backgroundColor: 'var(--amplify-colors-background-secondary)',
        padding: '1rem',
        width: '300px',
        height: '100vh',
        overflow: 'auto',
        borderRight: '1px solid var(--amplify-colors-border-primary)',
      }}
    >
      <Text fontWeight="bold" fontSize="large" marginBottom="1rem">
        Components
      </Text>

      {components.map((comp) => (
        <DraggableItem key={comp.name} id={comp.name} label={comp.label} />
      ))}
    </aside>
  );
};

export default DesignerSidebar;

