import React from 'react';
import { Toaster } from 'react-hot-toast';

import DynamicForm from './DynamicForm.jsx';
import Global from './context/Global.jsx';

class FormRoot extends React.Component {
  render() {
    return (
      <Global>
        <DynamicForm schemaId={this.props.schemaId}
          dmpId={this.props.dmpId}
          fragmentId={this.props.fragmentId}
          locale={this.props.locale} />
        <Toaster position="top-center" reverseOrder={false} />
      </Global>
    );
  }
}

export default FormRoot;
