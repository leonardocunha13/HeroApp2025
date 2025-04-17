import React from 'react';
import CreateFormDialog from './CreateFormDialog';

const DesignerSideBar: React.FC = () => {
  return (
    
      <CreateFormDialog onFormCreated={() => console.log('Form created')} />
    
  );
};

export default DesignerSideBar;