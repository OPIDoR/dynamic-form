import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import BuilderForm from '../Builder/BuilderForm.jsx';
import { parsePattern } from '../../utils/GeneratorUtils';
import { GlobalContext } from '../context/Global.jsx';
import { getContributors, getSchema } from '../../services/DmpServiceApi';

function SelectInvestigator({
  label,
  name,
  changeValue,
  templateId,
  keyValue,
  level,
  tooltip,
}) {
  const [show, setShow] = useState(false);
  const [options, setoptions] = useState(null);
  const {
    formData, setFormData, subData, setSubData, locale, dmpId,
  } = useContext(GlobalContext);
  const [index, setindex] = useState(null);
  const [template, setTemplate] = useState(null);
  const [role, setrole] = useState(null);
  const [selectedValue, setselectedValue] = useState(null);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getContributors(dmpId, templateId).then((res) => {
      const builtOptions = res.data.results.map((option) => ({
        value: option.id,
        label: option.text,
        object: option,
      }));
      setoptions(builtOptions);
    });
  }, []);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getSchema(templateId).then((res) => {
      const resTemplate = res.data;
      setrole(resTemplate.properties.role[`const@${locale}`]);
      setTemplate(resTemplate.properties.person.schema_id);
      const subTemplateId = resTemplate.properties.person.schema_id;
      setrole(resTemplate.properties.role[`const@${locale}`]);
      getSchema(subTemplateId).then((resSubTemplate) => {
        setTemplate(resSubTemplate.data);
        if (!formData[keyValue]) {
          return;
        }
        const patern = resSubTemplate.data.to_string;
        if (!patern.length) {
          return;
        }
        setselectedValue(parsePattern(formData[keyValue].person, patern));
      });
    });
  }, [templateId]);

  /**
   * It closes the modal and resets the state of the modal.
   */
  const handleClose = () => {
    setShow(false);
    setSubData(null);
    setindex(null);
  };
  /**
   * The function takes a boolean value as an argument and sets
   * the state of the show variable to the value of the argument.
   * @param isOpen - boolean
   */
  const handleShow = (isOpen) => {
    setShow(isOpen);
  };

  const handleChangeList = (e) => {
    const patern = template.to_string;
    const { object, value } = options[e.target.value];
    setselectedValue(options[e.target.value].value);
    if (patern.length > 0) {
      changeValue({ target: { name, value: [object] } });
      setFormData({ ...formData, [keyValue]: { person: object, role } });
    } else {
      changeValue({ target: { name, value } });
    }
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the subData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleAddToList = () => {
    // edit
    if (index !== null) {
      // const objectPerson = { person: subData, role: "from create" };
      setFormData({ ...formData, [keyValue]: { person: subData, role } });
      setselectedValue(parsePattern(subData, template.to_string));
    } else {
      // save new
      handleSave();
    }
    toast.success('Enregistrement a été effectué avec succès !');
    setSubData(null);
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the
   * temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close
   * the modal and set the temporary person object to null.
   */
  const handleSave = () => {
    // const objectPerson = { person: subData, role: "from create" };
    setFormData({ ...formData, [keyValue]: { person: subData, role } });
    handleClose();
    setSubData(null);
    setselectedValue(parsePattern(subData, template.to_string));
  };
  /**
   * It sets the state of the subData variable to the value of the form[keyValue][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (idx) => {
    setSubData(formData[keyValue].person);
    setShow(true);
    setindex(idx);
  };

  return (
    <>
      <div className="form-group">
        <label>{label}</label>
        {tooltip && (
          <span
            className="m-4"
            data-toggle="tooltip"
            data-placement="top"
            title={tooltip}
          >
            ?
          </span>
        )}
        <div className="row">
          <div className="col-md-10">
            {options && (
              <select className="form-control" onChange={handleChangeList}>
                <option>
                  Sélectionnez une valeur de la liste ou saisissez une nouvelle.
                </option>
                {options.map((o, idx) => (
                  <option key={idx} value={o.value}>
                    {o.label}
                  </option>
                ))}
                ;
              </select>
            )}
          </div>
          <div className="col-md-2" style={{ marginTop: '8px' }}>
            <span>
              <a
                className="text-primary"
                href="#"
                aria-hidden="true"
                onClick={handleShow}
              >
                <i className="fas fa-plus-square" />
              </a>
            </span>
          </div>
        </div>
        {selectedValue && (
          <div style={{ margin: '10px' }}>
            <strong>Valeur sélectionnée :</strong> {selectedValue}
            <a href="#" onClick={() => handleEdit(0)}>
              {' '}
              (modifié)
            </a>
          </div>
        )}
      </div>
      <>
        {template && (
          <Modal show={show} onHide={handleClose}>
            <Modal.Body>
              <BuilderForm
                shemaObject={template}
                level={level + 1}
              ></BuilderForm>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Fermer
              </Button>
              <Button variant="primary" onClick={handleAddToList}>
                Enregistrer
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    </>
  );
}

export default SelectInvestigator;
